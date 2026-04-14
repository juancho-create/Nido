import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type {
  NidoState, UserProfile, Bird, BiomeId,
  CheckInResult, RelapseResult, Resources,
} from '@/lib/types'
import { INITIAL_BIRDS } from '@/lib/data/birds'
import { BIOMES, getBiomeForStreak } from '@/lib/data/biomes'
import { INITIAL_ACHIEVEMENTS } from '@/lib/data/achievements'
import {
  getTodayString, generateId, isTodayString,
} from '@/lib/utils/dates'
import {
  calcCheckInRewards, calcCravingReward,
  addResources, spendSeeds, computeNewStreak, isMilestoneDay,
} from '@/lib/utils/rewards'

// ─── Store interface ──────────────────────────────────────────────────────────

interface NidoStore extends NidoState {
  // Onboarding
  completeOnboarding: (profile: Omit<UserProfile, 'id' | 'createdAt'>) => void

  // Core gameplay
  checkInToday: (note?: string) => CheckInResult | null
  registerRelapse: (note?: string) => RelapseResult
  resistCraving: () => void

  // Bird care
  feedBird: (birdId: string) => boolean

  // Selectors
  getActiveBirds: () => Bird[]
  getCurrentBiome: () => (typeof BIOMES)[0]

  // Dev helper
  _reset: () => void
}

// ─── Initial state ────────────────────────────────────────────────────────────

const INITIAL_STATE: NidoState = {
  user: null,
  isOnboarded: false,
  streak: {
    currentStreak: 0,
    longestStreak: 0,
    totalSmokeFree: 0,
    lastCheckInDate: null,
    todayCheckedIn: false,
  },
  birds: INITIAL_BIRDS.map((b) => ({ ...b })),
  resources: { seeds: 10, food: 3, gems: 0 },
  achievements: INITIAL_ACHIEVEMENTS.map((a) => ({ ...a })),
  journal: [],
  currentBiomeId: 'meadow',
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useNidoStore = create<NidoStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      // ── Onboarding ─────────────────────────────────────────────────────────

      completeOnboarding(profileInput) {
        const today = getTodayString()
        const profile: UserProfile = {
          ...profileInput,
          id: generateId(),
          createdAt: new Date().toISOString(),
        }

        set((state) => {
          // Unlock first bird immediately
          const birds = state.birds.map((b) =>
            b.id === 'sparrow-dawn'
              ? { ...b, status: 'healthy' as const, unlockedDate: today }
              : b,
          )
          return {
            user: profile,
            isOnboarded: true,
            birds,
          }
        })
      },

      // ── Daily check-in ─────────────────────────────────────────────────────

      checkInToday(note) {
        const state = get()
        const today = getTodayString()

        if (state.streak.todayCheckedIn) return null

        const newStreak = computeNewStreak(state.streak)
        const rewards   = calcCheckInRewards(newStreak.currentStreak)
        const resources = addResources(state.resources, rewards)
        const milestone = isMilestoneDay(newStreak.currentStreak)

        // Unlock birds whose threshold was just crossed
        const newBirdsUnlocked: Bird[] = []
        const birds = state.birds.map((bird) => {
          if (
            bird.status === 'locked' &&
            newStreak.currentStreak >= bird.unlockDays
          ) {
            newBirdsUnlocked.push(bird)
            return { ...bird, status: 'healthy' as const, unlockedDate: today }
          }
          // Recovering birds become healthy after 2 days (simplified: on next check-in)
          if (bird.status === 'recovering') {
            return { ...bird, status: 'healthy' as const }
          }
          return bird
        })

        // Unlock achievements
        const newAchievements: (typeof state.achievements[0])[] = []
        const achievements = state.achievements.map((ach) => {
          if (!ach.unlocked && newStreak.currentStreak >= ach.unlockDays) {
            const unlocked = { ...ach, unlocked: true, unlockedDate: today }
            newAchievements.push(unlocked)
            return unlocked
          }
          return ach
        })

        // Maybe upgrade biome
        const newBiome = getBiomeForStreak(newStreak.currentStreak)
        const biomeChanged = newBiome.id !== state.currentBiomeId

        // Journal entry
        const entry = {
          id: generateId(),
          date: today,
          type: 'smoke_free' as const,
          note,
          rewardsEarned: rewards,
          streakAtTime: newStreak.currentStreak,
        }

        set({
          streak: {
            ...newStreak,
            lastCheckInDate: today,
            todayCheckedIn: true,
          },
          birds,
          resources,
          achievements,
          currentBiomeId: newBiome.id,
          journal: [...state.journal, entry],
        })

        const result: CheckInResult = {
          newStreak: newStreak.currentStreak,
          rewards,
          newBirdsUnlocked,
          newAchievements,
          isMilestone: milestone,
          biomeChanged,
          newBiomeId: biomeChanged ? newBiome.id : null,
        }

        return result
      },

      // ── Relapse ────────────────────────────────────────────────────────────

      registerRelapse(note) {
        const state = get()
        const today = getTodayString()
        const streakLost = state.streak.currentStreak

        // Pick one healthy bird to leave temporarily
        const healthyBirds = state.birds.filter(
          (b) => b.status === 'healthy' && b.id !== 'sparrow-dawn',
        )
        const leavingBird = healthyBirds[0] ?? null

        // Pick a different healthy bird to get sick (include sparrow)
        const sickCandidates = state.birds.filter(
          (b) => b.status === 'healthy' && b.id !== leavingBird?.id,
        )
        const sickBird = sickCandidates[0] ?? null

        const birds = state.birds.map((b) => {
          if (b.id === leavingBird?.id) return { ...b, status: 'away' as const }
          if (b.id === sickBird?.id)    return { ...b, status: 'sick' as const }
          return b
        })

        const entry = {
          id: generateId(),
          date: today,
          type: 'relapse' as const,
          note,
          streakAtTime: streakLost,
        }

        set({
          streak: {
            ...state.streak,
            currentStreak:   0,
            lastCheckInDate: today,
            todayCheckedIn:  true, // can't check-in again today
          },
          birds,
          journal: [...state.journal, entry],
        })

        return {
          birdLeft: leavingBird,
          birdSick:  sickBird,
          streakLost,
        }
      },

      // ── Resist craving ─────────────────────────────────────────────────────

      resistCraving() {
        const state  = get()
        const today  = getTodayString()
        const rewards = calcCravingReward()
        const entry = {
          id: generateId(),
          date: today,
          type: 'craving_resisted' as const,
          rewardsEarned: rewards,
          streakAtTime: state.streak.currentStreak,
        }
        set({
          resources: addResources(state.resources, rewards),
          journal: [...state.journal, entry],
        })
      },

      // ── Feed bird ──────────────────────────────────────────────────────────

      feedBird(birdId) {
        const state = get()
        const bird  = state.birds.find((b) => b.id === birdId)
        if (!bird || bird.status === 'locked' || bird.status === 'away') return false

        const newResources = spendSeeds(state.resources, bird.feedCost)
        if (!newResources) return false

        const today = getTodayString()
        const birds = state.birds.map((b) => {
          if (b.id !== birdId) return b
          return {
            ...b,
            hungerLevel: 100,
            lastFed: today,
            // Sick birds recover when fed
            status: b.status === 'sick' ? ('recovering' as const) : b.status,
          }
        })

        set({ resources: newResources, birds })
        return true
      },

      // ── Selectors ──────────────────────────────────────────────────────────

      getActiveBirds() {
        return get().birds.filter((b) => b.status !== 'locked')
      },

      getCurrentBiome() {
        const id = get().currentBiomeId
        return BIOMES.find((b) => b.id === id) ?? BIOMES[0]
      },

      // ── Dev ────────────────────────────────────────────────────────────────

      _reset() {
        set(INITIAL_STATE)
      },
    }),
    {
      name: 'nido-storage',
      // Hydration guard: reset todayCheckedIn if the stored date ≠ today
      onRehydrateStorage: () => (state) => {
        if (!state) return
        const today = getTodayString()
        if (state.streak.lastCheckInDate !== today) {
          state.streak.todayCheckedIn = false
        }
      },
    },
  ),
)
