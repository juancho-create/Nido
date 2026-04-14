import type { Resources, StreakData } from '@/lib/types'

const MILESTONES = [1, 3, 7, 14, 21, 30, 60, 90]

export function isMilestoneDay(streak: number): boolean {
  return MILESTONES.includes(streak)
}

/** Seeds earned per check-in, with milestone bonuses */
export function calcCheckInRewards(streak: number): Partial<Resources> {
  const base = 5
  const milestone = isMilestoneDay(streak)

  if (streak >= 30)  return { seeds: base + (milestone ? 30 : 8), food: milestone ? 5 : 1, gems: milestone ? 2 : 0 }
  if (streak >= 14)  return { seeds: base + (milestone ? 20 : 5), food: milestone ? 3 : 1, gems: milestone ? 1 : 0 }
  if (streak >= 7)   return { seeds: base + (milestone ? 15 : 3), food: milestone ? 2 : 0 }
  return               { seeds: base + (milestone ? 10 : 0) }
}

/** Special reward for resisting a craving */
export function calcCravingReward(): Partial<Resources> {
  return { seeds: 8, gems: 1 }
}

export function addResources(current: Resources, delta: Partial<Resources>): Resources {
  return {
    seeds: current.seeds + (delta.seeds ?? 0),
    food:  current.food  + (delta.food  ?? 0),
    gems:  current.gems  + (delta.gems  ?? 0),
  }
}

export function spendSeeds(current: Resources, amount: number): Resources | null {
  if (current.seeds < amount) return null
  return { ...current, seeds: current.seeds - amount }
}

/** Human-readable streak label */
export function streakLabel(streak: number): string {
  if (streak === 0) return 'Empieza hoy'
  if (streak === 1) return '1 día'
  return `${streak} días`
}

/** Money saved calculation */
export function moneySaved(
  totalSmokeFree: number,
  cigarettesPerDay: number,
  pricePerPack: number,
  cigarettesPerPack: number
): number {
  const pricePerCig = pricePerPack / cigarettesPerPack
  return Math.round(totalSmokeFree * cigarettesPerDay * pricePerCig * 100) / 100
}

/** Cigarettes not smoked */
export function cigarettesNotSmoked(totalSmokeFree: number, cigarettesPerDay: number): number {
  return totalSmokeFree * cigarettesPerDay
}

/** Update streak given prior state */
export function computeNewStreak(prior: StreakData): StreakData {
  const newStreak = prior.currentStreak + 1
  return {
    ...prior,
    currentStreak:   newStreak,
    longestStreak:   Math.max(prior.longestStreak, newStreak),
    totalSmokeFree:  prior.totalSmokeFree + 1,
  }
}
