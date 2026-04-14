/**
 * NIDO — STREAK ENGINE
 * ──────────────────────────────────────────────────────────────────────────────
 * Funciones puras para calcular todo lo relacionado con la racha.
 * Sin efectos secundarios, sin estado global.
 */

import { differenceInDays, parseISO } from 'date-fns'
import {
  MILESTONE_DAYS,
  STREAK_RULES,
  USER_PHASES,
  type MilestoneDay,
  type UserPhaseId,
} from './constants'
import type { StreakState, UserPhase } from './types'

// ─── Fases ────────────────────────────────────────────────────────────────────

/**
 * Retorna la fase emocional del usuario según su racha actual.
 *
 * @example
 * getUserPhase(0)   // → 'spark'
 * getUserPhase(7)   // → 'growing'
 * getUserPhase(21)  // → 'rooted'
 * getUserPhase(60)  // → 'soaring'
 */
export function getUserPhase(streak: number): UserPhase {
  const phase = [...USER_PHASES]
    .reverse()
    .find((p) => streak >= p.minDays)
  return (phase ?? USER_PHASES[0]) as UserPhase
}

export function getUserPhaseId(streak: number): UserPhaseId {
  return getUserPhase(streak).id
}

// ─── Milestones ───────────────────────────────────────────────────────────────

/** ¿Es este día un hito especial? */
export function isMilestone(day: number): day is MilestoneDay {
  return (MILESTONE_DAYS as readonly number[]).includes(day)
}

/**
 * Próximo milestone a partir del día actual.
 * Retorna null si ya se completaron todos.
 *
 * @example
 * nextMilestone(0)   // → 1
 * nextMilestone(7)   // → 14
 * nextMilestone(90)  // → null
 */
export function nextMilestone(current: number): MilestoneDay | null {
  return (MILESTONE_DAYS as readonly number[]).find((m) => m > current) as MilestoneDay | null
}

/**
 * Días que faltan para el próximo milestone.
 *
 * @example
 * daysToNextMilestone(5)  // → 2   (próximo milestone: día 7)
 * daysToNextMilestone(90) // → null (ya no hay más)
 */
export function daysToNextMilestone(current: number): number | null {
  const next = nextMilestone(current)
  return next === null ? null : next - current
}

/**
 * Lista todos los milestones con su estado (alcanzado / pendiente).
 */
export function getMilestoneProgress(current: number): Array<{
  day: MilestoneDay
  reached: boolean
  isCurrent: boolean
}> {
  return MILESTONE_DAYS.map((day) => ({
    day,
    reached: current >= day,
    isCurrent: current === day,
  }))
}

// ─── Comprobaciones de check-in ───────────────────────────────────────────────

/**
 * ¿Puede el usuario hacer check-in hoy?
 * Solo se puede hacer check-in una vez por día.
 */
export function canCheckIn(streak: Pick<StreakState, 'todayCheckedIn'>): boolean {
  return !streak.todayCheckedIn
}

/**
 * ¿Cuántos días han pasado desde el último check-in?
 * Retorna 0 si hoy se hizo check-in, null si nunca hubo uno.
 */
export function daysSinceLastCheckIn(
  lastCheckInDate: string | null,
  today: string,
): number | null {
  if (!lastCheckInDate) return null
  return Math.max(0, differenceInDays(parseISO(today), parseISO(lastCheckInDate)))
}

/**
 * ¿Debe mostrarse la alerta suave de "¿sigues ahí?"?
 * No hay penalización, solo un recordatorio compasivo.
 */
export function shouldShowSoftReminder(
  lastCheckInDate: string | null,
  today: string,
): boolean {
  const days = daysSinceLastCheckIn(lastCheckInDate, today)
  if (days === null) return false
  return days >= STREAK_RULES.SOFT_REMINDER_DAYS
}

// ─── Transiciones de estado (funciones puras) ────────────────────────────────

/**
 * Aplica un check-in exitoso al estado de racha.
 *
 * Regla:
 * - current  += 1
 * - longest   = max(longest, current)
 * - totalSmokeFree += 1
 * - cravingsResistedToday se reinicia (nuevo día)
 */
export function applyCheckIn(state: StreakState, today: string): StreakState {
  const newCurrent = state.current + 1
  return {
    ...state,
    current:               newCurrent,
    longest:               Math.max(state.longest, newCurrent),
    totalSmokeFree:        state.totalSmokeFree + 1,
    lastCheckInDate:       today,
    todayCheckedIn:        true,
    cravingsResistedToday: 0,
  }
}

/**
 * Aplica una recaída al estado de racha.
 *
 * Reglas:
 * - current → 0     (racha reiniciada)
 * - longest NO cambia (la mejor marca se preserva)
 * - totalSmokeFree NO cambia (el historial es permanente)
 * - frozenStreak = current anterior (memoria compasiva)
 * - relapseCount += 1 (solo informativo)
 */
export function applyRelapse(state: StreakState, today: string): StreakState {
  return {
    ...state,
    frozenStreak:          state.current,
    current:               0,
    lastCheckInDate:       today,
    todayCheckedIn:        true,
    relapseCount:          state.relapseCount + 1,
    cravingsResistedToday: 0,
  }
}

/**
 * Aplica resistencia a un antojo (sin check-in completo).
 */
export function applyCravingResisted(state: StreakState): StreakState {
  return {
    ...state,
    cravingsResistedTotal: state.cravingsResistedTotal + 1,
    cravingsResistedToday: state.cravingsResistedToday + 1,
  }
}

/**
 * Reinicia el flag `todayCheckedIn` al comienzo de un nuevo día.
 * Llamar en `onRehydrateStorage` de Zustand.
 */
export function resetDailyFlags(state: StreakState, today: string): StreakState {
  if (state.lastCheckInDate === today) return state
  return {
    ...state,
    todayCheckedIn:        false,
    cravingsResistedToday: 0,
  }
}

// ─── Estadísticas derivadas ───────────────────────────────────────────────────

/**
 * Texto descriptivo de la racha actual.
 *
 * @example
 * streakLabel(0)   // "Empieza hoy"
 * streakLabel(1)   // "1 día"
 * streakLabel(15)  // "15 días"
 */
export function streakLabel(streak: number): string {
  if (streak === 0) return 'Empieza hoy'
  if (streak === 1) return '1 día'
  return `${streak} días`
}

/**
 * Porcentaje de progreso hacia el próximo milestone (0-100).
 *
 * @example
 * streakProgressPercent(10)  // ~43% (entre milestone 7 y 14)
 */
export function streakProgressPercent(current: number): number {
  const next = nextMilestone(current)
  if (next === null) return 100

  const prev = [...MILESTONE_DAYS].reverse().find((m) => m <= current) ?? 0
  const range = next - prev
  const progress = current - prev
  return Math.round((progress / range) * 100)
}

// ─── Estado inicial ────────────────────────────────────────────────────────────

export const INITIAL_STREAK_STATE: StreakState = {
  current:               0,
  longest:               0,
  totalSmokeFree:        0,
  lastCheckInDate:       null,
  todayCheckedIn:        false,
  frozenStreak:          null,
  relapseCount:          0,
  cravingsResistedTotal: 0,
  cravingsResistedToday: 0,
}

// ─── Ejemplos de datos (para tests / storybook) ───────────────────────────────

export const STREAK_EXAMPLES = {
  /** Usuario que acaba de empezar */
  freshStart: {
    ...INITIAL_STREAK_STATE,
  } satisfies StreakState,

  /** Una semana de racha */
  oneWeek: {
    ...INITIAL_STREAK_STATE,
    current:        7,
    longest:        7,
    totalSmokeFree: 7,
  } satisfies StreakState,

  /** Un mes completo */
  oneMonth: {
    ...INITIAL_STREAK_STATE,
    current:        30,
    longest:        30,
    totalSmokeFree: 30,
  } satisfies StreakState,

  /** Después de una recaída en día 15 */
  afterRelapse: {
    ...INITIAL_STREAK_STATE,
    current:        0,
    longest:        15,
    totalSmokeFree: 15,
    frozenStreak:   15,
    relapseCount:   1,
  } satisfies StreakState,
}
