/**
 * NIDO — SEED ECONOMY ENGINE
 * ──────────────────────────────────────────────────────────────────────────────
 * Funciones puras para calcular recompensas de semillas, comida y gemas.
 *
 * Economía de recursos:
 *   🌱 Semillas  — moneda principal, se ganan diariamente
 *   🍎 Comida    — más escasa, solo en milestones y rachas largas
 *   💎 Gemas     — rarísimas, resistencia + rachas muy largas
 */

import type { Resources } from '@/lib/types'
import {
  BASE_CHECKIN_SEEDS,
  CRAVING_RULES,
  FEED_COST,
  MILESTONE_REWARDS,
  STREAK_SEED_TIERS,
  type MilestoneDay,
} from './constants'
import { isMilestone } from './streak'
import type { CheckInReward, CravingReward } from './types'

// ─── Tiers de racha ───────────────────────────────────────────────────────────

/**
 * Retorna el tier de semillas activo para una racha dada.
 *
 * @example
 * getStreakTier(0)   // { from: 0,  seedBonus: 0  }
 * getStreakTier(7)   // { from: 7,  seedBonus: 3  }
 * getStreakTier(30)  // { from: 30, seedBonus: 12 }
 */
export function getStreakTier(streak: number) {
  return [...STREAK_SEED_TIERS]
    .reverse()
    .find((t) => streak >= t.from) ?? STREAK_SEED_TIERS[0]
}

/**
 * Semillas base de un check-in (sin milestone).
 * Incluye el bonus por tier de racha.
 */
export function baseCheckInSeeds(streak: number): number {
  return BASE_CHECKIN_SEEDS + getStreakTier(streak).seedBonus
}

// ─── Recompensa de check-in ───────────────────────────────────────────────────

/**
 * Calcula la recompensa COMPLETA de un check-in dado el nuevo valor de racha.
 *
 * Reglas:
 * 1. Si el día ES milestone → usa MILESTONE_REWARDS (reemplaza, no suma)
 * 2. Si NO es milestone    → semillas base + bonus por tier de racha
 *
 * @param newStreak  La racha DESPUÉS de aplicar el check-in
 *
 * @example
 * calcCheckInReward(1)   // { seeds: 15,  food: 0, gems: 0, isMilestone: true,  milestone: 1  }
 * calcCheckInReward(5)   // { seeds: 5,   food: 0, gems: 0, isMilestone: false, milestone: null }
 * calcCheckInReward(7)   // { seeds: 35,  food: 2, gems: 0, isMilestone: true,  milestone: 7  }
 * calcCheckInReward(10)  // { seeds: 8,   food: 0, gems: 0, isMilestone: false, milestone: null }
 */
export function calcCheckInReward(newStreak: number): CheckInReward {
  if (isMilestone(newStreak)) {
    const r = MILESTONE_REWARDS[newStreak as MilestoneDay]
    return { ...r, isMilestone: true, milestone: newStreak as MilestoneDay }
  }
  return {
    seeds:       baseCheckInSeeds(newStreak),
    food:        0,
    gems:        0,
    isMilestone: false,
    milestone:   null,
  }
}

// ─── Recompensa por resistencia a antojos ────────────────────────────────────

/**
 * Calcula la recompensa por resistir un antojo.
 *
 * Reglas:
 * 1. Si cravingsToday >= DAILY_LIMIT → blocked: true (no hay recompensa)
 * 2. El bonus aumenta con la racha (incentiva mantener constancia)
 *
 * @param streak         Racha actual
 * @param cravingsToday  Antojos ya resistidos hoy
 *
 * @example
 * calcCravingReward(0, 0)   // { seeds: 8,  gems: 1, blocked: false }
 * calcCravingReward(7, 1)   // { seeds: 12, gems: 1, blocked: false }
 * calcCravingReward(30, 0)  // { seeds: 18, gems: 2, blocked: false }
 * calcCravingReward(0, 3)   // { seeds: 0,  gems: 0, blocked: true  } (límite diario)
 */
export function calcCravingReward(streak: number, cravingsToday: number): CravingReward {
  if (cravingsToday >= CRAVING_RULES.DAILY_LIMIT) {
    return { seeds: 0, gems: 0, blocked: true }
  }

  const tier = [...CRAVING_RULES.STREAK_BONUS_TIERS]
    .reverse()
    .find((t) => streak >= t.from) ?? CRAVING_RULES.STREAK_BONUS_TIERS[0]

  return { seeds: tier.seeds, gems: tier.gems, blocked: false }
}

// ─── Operaciones de recursos ──────────────────────────────────────────────────

/** Suma un delta parcial de recursos al estado actual. */
export function addResources(
  current: Resources,
  delta: Partial<Resources>,
): Resources {
  return {
    seeds: current.seeds + (delta.seeds ?? 0),
    food:  current.food  + (delta.food  ?? 0),
    gems:  current.gems  + (delta.gems  ?? 0),
  }
}

/**
 * Gasta semillas para alimentar un ave.
 * Retorna null si no hay suficientes semillas.
 *
 * @example
 * spendSeedsForFeed({ seeds: 5, food: 0, gems: 0 }, 'common')
 * // → { seeds: 3, food: 0, gems: 0 }
 *
 * spendSeedsForFeed({ seeds: 1, food: 0, gems: 0 }, 'common')
 * // → null  (no puede)
 */
export function spendSeedsForFeed(
  current: Resources,
  rarity: string,
): Resources | null {
  const cost = FEED_COST[rarity] ?? 2
  if (current.seeds < cost) return null
  return { ...current, seeds: current.seeds - cost }
}

/** ¿Puede el usuario alimentar un ave de esta rareza? */
export function canAffordFeed(resources: Resources, rarity: string): boolean {
  return resources.seeds >= (FEED_COST[rarity] ?? 2)
}

/**
 * Proyección de semillas que se ganarán en los próximos N días
 * (útil para UI de progreso / motivación).
 *
 * @example
 * projectSeeds(7, 3)
 * // → [8, 8, 8]  (días 8, 9, 10 — tier: streak 7+ → bonus 3 → 8/día)
 */
export function projectSeeds(currentStreak: number, days: number): number[] {
  return Array.from({ length: days }, (_, i) => {
    const dayStreak = currentStreak + i + 1
    if (isMilestone(dayStreak)) {
      return MILESTONE_REWARDS[dayStreak as MilestoneDay].seeds
    }
    return baseCheckInSeeds(dayStreak)
  })
}

// ─── Cálculos de salud/económicos ────────────────────────────────────────────

/**
 * Dinero ahorrado desde que se dejó de fumar.
 *
 * @param totalSmokeFree     Días sin fumar (histórico)
 * @param cigarettesPerDay   Cigarrillos que fumaba por día
 * @param pricePerPack       Precio de la cajetilla
 * @param cigarettesPerPack  Cigarrillos por cajetilla
 */
export function calcMoneySaved(
  totalSmokeFree: number,
  cigarettesPerDay: number,
  pricePerPack: number,
  cigarettesPerPack: number,
): number {
  if (cigarettesPerPack === 0) return 0
  const pricePerCig = pricePerPack / cigarettesPerPack
  return Math.round(totalSmokeFree * cigarettesPerDay * pricePerCig * 100) / 100
}

/** Total de cigarrillos no fumados. */
export function calcCigarettesNotSmoked(
  totalSmokeFree: number,
  cigarettesPerDay: number,
): number {
  return totalSmokeFree * cigarettesPerDay
}

/** Minutos de vida ganados (cada cigarrillo roba ~11 minutos). */
export function calcLifeMinutesGained(totalSmokeFree: number, cigarettesPerDay: number): number {
  return calcCigarettesNotSmoked(totalSmokeFree, cigarettesPerDay) * 11
}

// ─── Estado inicial ────────────────────────────────────────────────────────────

export const INITIAL_RESOURCES: Resources = {
  seeds: 10,
  food:  3,
  gems:  0,
}

// ─── Ejemplos (para tests) ────────────────────────────────────────────────────

/**
 * Tabla de recompensas esperadas para los primeros 30 días.
 * Útil como documentación viva y referencia de balance del juego.
 */
export const REWARD_TABLE = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1
  const reward = calcCheckInReward(day)
  return { day, ...reward }
})
