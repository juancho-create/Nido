/**
 * NIDO — RELAPSE ENGINE
 * ──────────────────────────────────────────────────────────────────────────────
 * Consecuencias de una recaída y el sistema de mensajes compasivos.
 *
 * Principios de diseño:
 *   ❶ Una recaída no borra el progreso histórico.
 *   ❷ Las consecuencias son visibles pero reversibles.
 *   ❸ El tono nunca es de castigo sino de acompañamiento.
 *   ❹ El usuario siempre tiene un camino claro para volver.
 *
 * Consecuencias de una recaída:
 *   - streak.current → 0
 *   - streak.frozenStreak = current anterior  (memoria compasiva)
 *   - 1 ave sana → 'away'   (se fue temporalmente)
 *   - 1 ave sana → 'sick'   (necesita cuidado)
 *   - Bioma NO retroede     (los avances de bioma son permanentes)
 *   - Recursos NO se pierden
 *   - totalSmokeFree NO se toca
 */

import type { Bird } from '@/lib/types'
import type { StreakState, GameEvent } from './types'
import { applyRelapse } from './streak'
import { applyBirdsOnRelapse } from './birds'
import { getTodayString } from '@/lib/utils/dates'

// ─── Resultado de una recaída ─────────────────────────────────────────────────

export interface RelapseOutcome {
  /** Nuevo estado de racha */
  newStreak: StreakState
  /** Aves actualizadas */
  birds: Bird[]
  /** Ave que se fue (puede ser null si no había candidatas) */
  birdLeft: Bird | null
  /** Ave que enfermó */
  birdSick: Bird | null
  /** Días de racha perdidos (para mostrar en UI) */
  streakLost: number
  /** Mensaje principal */
  message: string
  /** Afirmación positiva para continuar */
  affirmation: string
  /** Evento para el log */
  event: Extract<GameEvent, { type: 'RELAPSE' }>
}

// ─── Mensajes compasivos ──────────────────────────────────────────────────────

/**
 * Mensajes principales según el streak perdido.
 * Más streak perdido → reconocimiento más explícito del esfuerzo.
 */
const RELAPSE_MESSAGES = [
  // streak < 3
  {
    minStreak: 0,
    message:   'Un tropiezo en el comienzo. Lo más difícil ya lo hiciste: empezar.',
  },
  // streak 3-6
  {
    minStreak: 3,
    message:   'Tuviste días valientes. Un tropiezo no los borra.',
  },
  // streak 7-13
  {
    minStreak: 7,
    message:   'Una semana de fuerza está dentro de ti. Siempre lo estará.',
  },
  // streak 14-20
  {
    minStreak: 14,
    message:   'Dos semanas de constancia no desaparecen. Viven en tu cuerpo.',
  },
  // streak 21-29
  {
    minStreak: 21,
    message:   'Rompiste el hábito una vez. Puedes volver a hacerlo.',
  },
  // streak 30-59
  {
    minStreak: 30,
    message:   'Un mes entero fue tuyo. Sabes exactamente de qué eres capaz.',
  },
  // streak 60+
  {
    minStreak: 60,
    message:   'Has llegado tan lejos. Este tropiezo es solo eso: un tropiezo.',
  },
] as const

/**
 * Afirmaciones para el camino hacia adelante.
 * Se eligen aleatoriamente para que cada recaída se sienta diferente.
 */
const AFFIRMATIONS = [
  'Mañana es un nuevo día. Tu nido espera.',
  'El camino sigue exactamente donde lo dejaste.',
  'La racha que viene será aún más tuya.',
  'Cada intento enseña algo que el siguiente aprovecha.',
  'Tu nido nunca te juzga. Siempre te espera.',
  'Lo que construiste no desaparece. Empieza de nuevo con más sabiduría.',
  'Las aves volverán cuando las cuides. Como tú vas a cuidarte.',
] as const

function getRelapseMessage(streakLost: number): string {
  const entry = [...RELAPSE_MESSAGES]
    .reverse()
    .find((m) => streakLost >= m.minStreak)
  return entry?.message ?? RELAPSE_MESSAGES[0].message
}

function getRandomAffirmation(): string {
  return AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]
}

// ─── Función principal ────────────────────────────────────────────────────────

/**
 * Calcula todas las consecuencias de una recaída.
 *
 * Es una función pura excepto por la fecha (se puede inyectar para testing).
 *
 * @example
 * const outcome = computeRelapseOutcome(currentStreak, birds)
 * // → {
 * //     newStreak:  { current: 0, frozenStreak: 15, ... },
 * //     birds:      [...],
 * //     birdLeft:   { id: 'robin-hope', status: 'away', ... },
 * //     birdSick:   { id: 'sparrow-dawn', status: 'sick', ... },
 * //     streakLost: 15,
 * //     message:    "Una semana de fuerza...",
 * //     affirmation: "Mañana es un nuevo día...",
 * //   }
 */
export function computeRelapseOutcome(
  streak: StreakState,
  birds: Bird[],
  note?: string,
  today: string = getTodayString(),
): RelapseOutcome {
  const streakLost = streak.current

  // Actualizar racha
  const newStreak = applyRelapse(streak, today)

  // Actualizar aves
  const { birds: updatedBirds, leaving, sick } = applyBirdsOnRelapse(birds)

  const event: Extract<GameEvent, { type: 'RELAPSE' }> = {
    type:        'RELAPSE',
    date:        today,
    note,
    streakLost,
    birdLeftId:  leaving?.id ?? null,
    birdSickId:  sick?.id    ?? null,
  }

  return {
    newStreak,
    birds:       updatedBirds,
    birdLeft:    leaving,
    birdSick:    sick,
    streakLost,
    message:     getRelapseMessage(streakLost),
    affirmation: getRandomAffirmation(),
    event,
  }
}

// ─── Análisis de recaídas (para la pantalla de progreso) ─────────────────────

export interface RelapseStats {
  total: number
  averageStreakAtRelapse: number
  lastRelapseStreak: number | null
  isImproving: boolean  // última racha > racha en la penúltima recaída
}

/**
 * Estadísticas no punitivas sobre las recaídas del usuario.
 * Se muestran en modo "aprendizaje", no en modo "castigo".
 */
export function computeRelapseStats(
  events: Array<Extract<GameEvent, { type: 'RELAPSE' }>>,
): RelapseStats {
  if (events.length === 0) {
    return {
      total:                     0,
      averageStreakAtRelapse:    0,
      lastRelapseStreak:         null,
      isImproving:               true,
    }
  }

  const streaks = events.map((e) => e.streakLost)
  const avg = Math.round(streaks.reduce((a, b) => a + b, 0) / streaks.length)
  const last = streaks[streaks.length - 1]
  const secondToLast = streaks[streaks.length - 2] ?? null

  return {
    total:                  events.length,
    averageStreakAtRelapse: avg,
    lastRelapseStreak:      last,
    isImproving:            secondToLast === null ? true : last > secondToLast,
  }
}
