/**
 * NIDO — ZUSTAND STORE
 * ──────────────────────────────────────────────────────────────────────────────
 * Estado global de la aplicación.
 *
 * El store es delgado: solo orquesta llamadas al engine (lib/engine) y persiste
 * el resultado. Toda la lógica de juego vive en funciones puras del engine.
 *
 * Preparado para Supabase: cada mutación local puede tener un paralelo en
 * el backend (las acciones ya tienen GameEvent tipado para ello).
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type {
  NidoState, UserProfile, Bird, BiomeId,
  CheckInResult, RelapseResult, Resources,
} from '@/lib/types'
import { INITIAL_BIRDS }        from '@/lib/data/birds'
import { BIOMES }               from '@/lib/data/biomes'
import { INITIAL_ACHIEVEMENTS } from '@/lib/data/achievements'
import { getTodayString, generateId } from '@/lib/utils/dates'

// Engine imports
import {
  // Streak
  applyCheckIn,
  resetDailyFlags,
  applyCravingResisted,
  INITIAL_STREAK_STATE,
  // Seeds
  calcCheckInReward,
  calcCravingReward,
  addResources,
  spendSeedsForFeed,
  INITIAL_RESOURCES,
  // Birds
  applyBirdsOnCheckIn,
  applyFeedBird,
  getFeedCost,
  // Biomes
  getBiomeId,
  didBiomeChange,
  // Relapse
  computeRelapseOutcome,
} from '@/lib/engine'

import type { StreakState } from '@/lib/engine'

// ─── Store interface ──────────────────────────────────────────────────────────

interface NidoStore extends NidoState {
  // Onboarding
  completeOnboarding: (profile: Omit<UserProfile, 'id' | 'createdAt'>) => void

  // Core gameplay
  checkInToday:    (note?: string) => CheckInResult | null
  registerRelapse: (note?: string) => RelapseResult
  resistCraving:   ()              => void

  // Bird care
  feedBird: (birdId: string) => boolean

  // Selectors
  getActiveBirds:   () => Bird[]
  getCurrentBiome:  () => (typeof BIOMES)[0]

  // Internal streak (full engine shape, used by engine functions)
  _streakFull: StreakState

  // Dev
  _reset: () => void
}

// ─── Helpers de conversión StreakData ↔ StreakState ────────────────────────────

/** El store usa StreakData (forma simple) para persistencia; el engine usa StreakState. */
function toEngineStreak(s: NidoState['streak'], full?: Partial<StreakState>): StreakState {
  return {
    current:               s.currentStreak,
    longest:               s.longestStreak,
    totalSmokeFree:        s.totalSmokeFree,
    lastCheckInDate:       s.lastCheckInDate,
    todayCheckedIn:        s.todayCheckedIn,
    frozenStreak:          full?.frozenStreak          ?? null,
    relapseCount:          full?.relapseCount          ?? 0,
    cravingsResistedTotal: full?.cravingsResistedTotal ?? 0,
    cravingsResistedToday: full?.cravingsResistedToday ?? 0,
  }
}

function fromEngineStreak(s: StreakState): NidoState['streak'] {
  return {
    currentStreak:   s.current,
    longestStreak:   s.longest,
    totalSmokeFree:  s.totalSmokeFree,
    lastCheckInDate: s.lastCheckInDate,
    todayCheckedIn:  s.todayCheckedIn,
  }
}

// ─── Estado inicial ────────────────────────────────────────────────────────────

const BASE_STATE: NidoState = {
  user:          null,
  isOnboarded:   false,
  streak: {
    currentStreak:   0,
    longestStreak:   0,
    totalSmokeFree:  0,
    lastCheckInDate: null,
    todayCheckedIn:  false,
  },
  birds:        INITIAL_BIRDS.map((b) => ({ ...b })),
  resources:    { ...INITIAL_RESOURCES },
  achievements: INITIAL_ACHIEVEMENTS.map((a) => ({ ...a })),
  journal:      [],
  currentBiomeId: 'meadow',
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useNidoStore = create<NidoStore>()(
  persist(
    (set, get) => ({
      ...BASE_STATE,
      _streakFull: INITIAL_STREAK_STATE,

      // ── Onboarding ─────────────────────────────────────────────────────────

      completeOnboarding(profileInput) {
        const today   = getTodayString()
        const profile: UserProfile = {
          ...profileInput,
          id:        generateId(),
          createdAt: new Date().toISOString(),
        }

        set((state) => {
          const birds = state.birds.map((b) =>
            b.id === 'sparrow-dawn'
              ? { ...b, status: 'healthy' as const, unlockedDate: today }
              : b,
          )
          return { user: profile, isOnboarded: true, birds }
        })
      },

      // ── Daily check-in ─────────────────────────────────────────────────────

      checkInToday(note) {
        const state = get()
        if (state.streak.todayCheckedIn) return null

        const today       = getTodayString()
        const engStreak   = toEngineStreak(state.streak, state._streakFull)

        // 1. Update streak
        const newEngStreak = applyCheckIn(engStreak, today)

        // 2. Calculate reward
        const reward = calcCheckInReward(newEngStreak.current)

        // 3. Update resources
        const resources = addResources(state.resources, {
          seeds: reward.seeds,
          food:  reward.food,
          gems:  reward.gems,
        })

        // 4. Apply bird transitions (unlock, recover, hunger)
        const { birds, unlocked, returned } = applyBirdsOnCheckIn(
          state.birds,
          newEngStreak.current,
          today,
        )

        // 5. Unlock achievements
        const newAchievements: typeof state.achievements = []
        const achievements = state.achievements.map((ach) => {
          if (!ach.unlocked && newEngStreak.current >= ach.unlockDays) {
            const updated = { ...ach, unlocked: true, unlockedDate: today }
            newAchievements.push(updated)
            return updated
          }
          return ach
        })

        // 6. Maybe upgrade biome
        const prevBiome     = getBiomeId(engStreak.current)
        const nextBiome     = getBiomeId(newEngStreak.current)
        const biomeChanged  = prevBiome !== nextBiome
        const currentBiomeId: BiomeId = nextBiome

        // 7. Journal
        const entry = {
          id:           generateId(),
          date:         today,
          type:         'smoke_free' as const,
          note,
          rewardsEarned: { seeds: reward.seeds, food: reward.food, gems: reward.gems },
          streakAtTime:  newEngStreak.current,
        }

        set({
          streak:        fromEngineStreak(newEngStreak),
          _streakFull:   newEngStreak,
          birds,
          resources,
          achievements,
          currentBiomeId,
          journal:       [...state.journal, entry],
        })

        const result: CheckInResult = {
          newStreak:        newEngStreak.current,
          rewards:          { seeds: reward.seeds, food: reward.food, gems: reward.gems },
          newBirdsUnlocked: unlocked,
          newAchievements,
          isMilestone:      reward.isMilestone,
          biomeChanged,
          newBiomeId:       biomeChanged ? nextBiome : null,
        }

        return result
      },

      // ── Relapse ────────────────────────────────────────────────────────────

      registerRelapse(note) {
        const state      = get()
        const today      = getTodayString()
        const engStreak  = toEngineStreak(state.streak, state._streakFull)

        const outcome = computeRelapseOutcome(engStreak, state.birds, note, today)

        const entry = {
          id:          generateId(),
          date:        today,
          type:        'relapse' as const,
          note,
          streakAtTime: outcome.event.streakLost,
        }

        set({
          streak:      fromEngineStreak(outcome.newStreak),
          _streakFull: outcome.newStreak,
          birds:       outcome.birds,
          journal:     [...state.journal, entry],
        })

        return {
          birdLeft:   outcome.birdLeft,
          birdSick:   outcome.birdSick,
          streakLost: outcome.streakLost,
        }
      },

      // ── Resist craving ─────────────────────────────────────────────────────

      resistCraving() {
        const state      = get()
        const today      = getTodayString()
        const engStreak  = toEngineStreak(state.streak, state._streakFull)

        const reward = calcCravingReward(
          engStreak.current,
          engStreak.cravingsResistedToday,
        )

        if (reward.blocked) return

        const newEngStreak = applyCravingResisted(engStreak)
        const entry = {
          id:           generateId(),
          date:         today,
          type:         'craving_resisted' as const,
          rewardsEarned: { seeds: reward.seeds, gems: reward.gems },
          streakAtTime:  engStreak.current,
        }

        set({
          _streakFull: newEngStreak,
          resources:   addResources(state.resources, { seeds: reward.seeds, gems: reward.gems }),
          journal:     [...state.journal, entry],
        })
      },

      // ── Feed bird ──────────────────────────────────────────────────────────

      feedBird(birdId) {
        const state = get()
        const bird  = state.birds.find((b) => b.id === birdId)
        if (!bird || bird.status === 'locked' || bird.status === 'away') return false

        const newResources = spendSeedsForFeed(state.resources, bird.rarity)
        if (!newResources) return false

        const today   = getTodayString()
        const updated = applyFeedBird(bird, today)

        set({
          resources: newResources,
          birds:     state.birds.map((b) => (b.id === birdId ? updated : b)),
        })
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
        set({ ...BASE_STATE, _streakFull: INITIAL_STREAK_STATE })
      },
    }),
    {
      name: 'nido-storage',
      partialize: (state) => ({
        user:          state.user,
        isOnboarded:   state.isOnboarded,
        streak:        state.streak,
        _streakFull:   state._streakFull,
        birds:         state.birds,
        resources:     state.resources,
        achievements:  state.achievements,
        journal:       state.journal,
        currentBiomeId: state.currentBiomeId,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return
        const today = getTodayString()
        // Reset daily flags if it's a new day
        if (state.streak.lastCheckInDate !== today) {
          state.streak.todayCheckedIn = false
          if (state._streakFull) {
            state._streakFull = resetDailyFlags(state._streakFull, today)
          }
        }
      },
    },
  ),
)
