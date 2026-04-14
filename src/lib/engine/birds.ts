/**
 * NIDO — BIRD ENGINE
 * ──────────────────────────────────────────────────────────────────────────────
 * Funciones puras para gestionar el estado de las aves.
 *
 * Ciclo de vida de un ave:
 *
 *   locked → healthy (al alcanzar unlockDays)
 *   healthy → sick   (hambre < SICK threshold)
 *   sick    → away   (hambre = 0)
 *   sick    → recovering (al ser alimentada)
 *   away    → recovering (al alcanzar AWAY_BIRD_RETURN_STREAK días tras recaída)
 *   recovering → healthy (en el siguiente check-in)
 *
 * En caso de recaída:
 *   healthy → away  (un ave no-sparrow)
 *   healthy → sick  (otra ave no-sparrow, o sparrow si es la única opción)
 *
 * El Gorrión del Amanecer ('sparrow-dawn') NUNCA abandona el nido.
 * Es el ancla emocional del usuario.
 */

import { differenceInDays, parseISO } from 'date-fns'
import type { Bird, BirdStatus, BiomeId } from '@/lib/types'
import {
  HUNGER_DECAY_PER_DAY,
  HUNGER_THRESHOLDS,
  STREAK_RULES,
  AWAY_BIRD_RETURN_STREAK,
  FEED_COST,
} from './constants'

// ─── Hambre ────────────────────────────────────────────────────────────────────

/**
 * Calcula el nivel de hambre actual de un ave según los días transcurridos.
 *
 * @param currentHunger  Nivel almacenado en el estado
 * @param lastFedDate    Última vez que fue alimentada ("YYYY-MM-DD" o null)
 * @param today          Fecha de hoy ("YYYY-MM-DD")
 * @param rarity         Rareza del ave (afecta la velocidad de decay)
 *
 * @example
 * calcCurrentHunger(100, '2024-01-01', '2024-01-03', 'common')
 * // → 88  (100 - 2 días × 6 decay/día)
 *
 * calcCurrentHunger(100, null, '2024-01-05', 'legendary')
 * // → 100  (nunca alimentada = no ha habido decay aún)
 */
export function calcCurrentHunger(
  currentHunger: number,
  lastFedDate: string | null,
  today: string,
  rarity: string,
): number {
  if (!lastFedDate) return currentHunger  // aún no ha habido un ciclo completo
  const daysPassed = Math.max(
    0,
    differenceInDays(parseISO(today), parseISO(lastFedDate)),
  )
  if (daysPassed === 0) return currentHunger
  const decay = (HUNGER_DECAY_PER_DAY[rarity] ?? 8) * daysPassed
  return Math.max(0, currentHunger - decay)
}

/**
 * Determina el BirdStatus correcto según el nivel de hambre.
 * No afecta aves 'locked' (esas tienen su propia lógica).
 *
 * Reglas:
 *   hunger > HEALTHY  → 'healthy'
 *   hunger > SICK     → 'healthy' (visible pero con aura de hambre en UI)
 *   hunger <= SICK    → 'sick'
 *   hunger <= AWAY    → 'away'
 */
export function birdStatusFromHunger(hunger: number): Extract<BirdStatus, 'healthy' | 'sick' | 'away'> {
  if (hunger <= HUNGER_THRESHOLDS.AWAY) return 'away'
  if (hunger <= HUNGER_THRESHOLDS.SICK) return 'sick'
  return 'healthy'
}

/**
 * Actualiza el hambre de un ave según la fecha actual.
 * Retorna el ave con el status correcto según el nuevo nivel de hambre.
 * No modifica aves 'locked', 'away' (esperando vuelta), o 'recovering'.
 */
export function updateBirdHunger(bird: Bird, today: string): Bird {
  if (bird.status === 'locked' || bird.status === 'away' || bird.status === 'recovering') {
    return bird
  }

  const newHunger = calcCurrentHunger(
    bird.hungerLevel,
    bird.lastFed,
    today,
    bird.rarity,
  )
  const newStatus = birdStatusFromHunger(newHunger)

  return { ...bird, hungerLevel: newHunger, status: newStatus }
}

/**
 * Aplica el efecto de alimentar un ave.
 *
 * Transiciones:
 *   sick       → recovering  (necesita un día para recuperarse del todo)
 *   recovering → recovering  (ya está mejor)
 *   healthy    → healthy     (mantiene estado)
 *
 * La transición recovering → healthy ocurre en el siguiente check-in.
 */
export function applyFeedBird(bird: Bird, today: string): Bird {
  return {
    ...bird,
    hungerLevel: 100,
    lastFed: today,
    status: bird.status === 'sick' ? 'recovering' : bird.status,
  }
}

/**
 * Coste en semillas para alimentar un ave.
 */
export function getFeedCost(rarity: string): number {
  return FEED_COST[rarity] ?? 2
}

// ─── Desbloqueos ──────────────────────────────────────────────────────────────

/**
 * Devuelve las aves que deben desbloquearse dado el nuevo valor de racha.
 * Solo devuelve las que cruzan el umbral ahora (no las ya desbloqueadas).
 *
 * @example
 * getBirdsToUnlock(birds, 7, '2024-01-08')
 * // → [hummingbird-pulse]  (unlockDays: 7)
 */
export function getBirdsToUnlock(
  birds: Bird[],
  newStreak: number,
  today: string,
): Bird[] {
  return birds
    .filter((b) => b.status === 'locked' && newStreak >= b.unlockDays)
    .map((b) => ({
      ...b,
      status:       'healthy' as BirdStatus,
      unlockedDate: today,
      hungerLevel:  100,
      lastFed:      today,
    }))
}

/**
 * Aves que regresan de 'away' dado el streak actual.
 * Una vez que la racha supera AWAY_BIRD_RETURN_STREAK desde la recaída,
 * los pájaros ausentes vuelven como 'recovering'.
 */
export function getBirdsReturning(
  birds: Bird[],
  currentStreak: number,
): Bird[] {
  if (currentStreak < AWAY_BIRD_RETURN_STREAK) return []
  return birds
    .filter((b) => b.status === 'away')
    .map((b) => ({ ...b, status: 'recovering' as BirdStatus }))
}

/**
 * Aves en estado 'recovering' que progresan a 'healthy' en un check-in.
 */
export function getBirdsRecovering(birds: Bird[]): Bird[] {
  return birds
    .filter((b) => b.status === 'recovering')
    .map((b) => ({ ...b, status: 'healthy' as BirdStatus }))
}

/**
 * Aplica todas las transiciones de estado de aves en un check-in exitoso:
 * 1. Actualiza hambre de aves activas
 * 2. Desbloquea nuevas aves
 * 3. Regresa aves ausentes si la racha lo permite
 * 4. Recupera aves 'recovering'
 *
 * Retorna el array completo de aves actualizado.
 */
export function applyBirdsOnCheckIn(
  birds: Bird[],
  newStreak: number,
  today: string,
): { birds: Bird[]; unlocked: Bird[]; returned: Bird[] } {
  // 1. Actualizar hambre
  let updated = birds.map((b) => updateBirdHunger(b, today))

  // 2. Desbloquear
  const toUnlock = getBirdsToUnlock(updated, newStreak, today)
  const unlockIds = new Set(toUnlock.map((b) => b.id))
  updated = updated.map((b) => (unlockIds.has(b.id) ? toUnlock.find((u) => u.id === b.id)! : b))

  // 3. Regresar ausentes
  const toReturn = getBirdsReturning(updated, newStreak)
  const returnIds = new Set(toReturn.map((b) => b.id))
  updated = updated.map((b) => (returnIds.has(b.id) ? toReturn.find((r) => r.id === b.id)! : b))

  // 4. Recuperar 'recovering'
  updated = updated.map((b) =>
    b.status === 'recovering' ? { ...b, status: 'healthy' as BirdStatus } : b,
  )

  return { birds: updated, unlocked: toUnlock, returned: toReturn }
}

// ─── Recaída ──────────────────────────────────────────────────────────────────

/**
 * Selecciona qué aves se ven afectadas por una recaída.
 *
 * Reglas:
 * 1. 'sparrow-dawn' NUNCA abandona el nido (STREAK_RULES.PROTECTED_BIRD_ID)
 * 2. Si hay más de 1 ave sana (sin contar sparrow):
 *    - La primera elegible → 'away'
 *    - La segunda elegible → 'sick'
 * 3. Si solo hay 1 ave sana no-sparrow:
 *    - Esa → 'away'
 *    - El sparrow → 'sick'
 * 4. Si solo está el sparrow:
 *    - El sparrow → 'sick' (nunca 'away')
 *
 * El resultado es siempre empático: nunca se puede perder todo.
 */
export function selectRelapseTargets(birds: Bird[]): {
  leaving: Bird | null
  sick: Bird | null
} {
  const healthyNonSparrow = birds.filter(
    (b) =>
      b.status === 'healthy' &&
      b.id !== STREAK_RULES.PROTECTED_BIRD_ID,
  )

  // Caso: hay 2+ aves sanas (sin sparrow)
  if (healthyNonSparrow.length >= 2) {
    return {
      leaving: healthyNonSparrow[0],
      sick:    healthyNonSparrow[1],
    }
  }

  // Caso: solo 1 ave sana no-sparrow
  if (healthyNonSparrow.length === 1) {
    const sparrow = birds.find((b) => b.id === STREAK_RULES.PROTECTED_BIRD_ID)
    return {
      leaving: healthyNonSparrow[0],
      sick:    sparrow?.status === 'healthy' ? sparrow : null,
    }
  }

  // Caso: solo queda el sparrow (o no hay aves sanas)
  const sparrow = birds.find((b) => b.id === STREAK_RULES.PROTECTED_BIRD_ID)
  if (sparrow?.status === 'healthy') {
    return { leaving: null, sick: sparrow }
  }

  return { leaving: null, sick: null }
}

/**
 * Aplica las consecuencias de una recaída al array de aves.
 */
export function applyBirdsOnRelapse(birds: Bird[]): {
  birds: Bird[]
  leaving: Bird | null
  sick: Bird | null
} {
  const { leaving, sick } = selectRelapseTargets(birds)

  const updated = birds.map((b) => {
    if (b.id === leaving?.id) return { ...b, status: 'away'  as BirdStatus }
    if (b.id === sick?.id)    return { ...b, status: 'sick'  as BirdStatus }
    return b
  })

  return { birds: updated, leaving, sick }
}

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Aves visibles (no bloqueadas). */
export function getActiveBirds(birds: Bird[]): Bird[] {
  return birds.filter((b) => b.status !== 'locked')
}

/** Aves que necesitan atención urgente (enfermas o ausentes). */
export function getBirdsNeedingCare(birds: Bird[]): Bird[] {
  return birds.filter((b) => b.status === 'sick' || b.status === 'away')
}

/** ¿Algún ave necesita cuidado urgente? */
export function hasUrgentCare(birds: Bird[]): boolean {
  return birds.some((b) => b.status === 'sick' || b.status === 'away')
}

/** Porcentaje de salud promedio del nido (0-100). */
export function habitatHealthPercent(birds: Bird[]): number {
  const active = getActiveBirds(birds)
  if (active.length === 0) return 100
  const total = active.reduce((sum, b) => {
    if (b.status === 'away') return sum        // no aporta
    if (b.status === 'sick') return sum + 20   // cuenta mucho menos
    return sum + b.hungerLevel
  }, 0)
  return Math.round(total / active.length)
}

/**
 * Próxima ave que se puede desbloquear.
 */
export function getNextBirdToUnlock(birds: Bird[], currentStreak: number): Bird | null {
  const locked = birds
    .filter((b) => b.status === 'locked')
    .sort((a, b) => a.unlockDays - b.unlockDays)
  return locked[0] ?? null
}
