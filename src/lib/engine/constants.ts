/**
 * NIDO — GAME CONSTANTS
 * ──────────────────────────────────────────────────────────────────────────────
 * Fuente única de verdad para todas las reglas numéricas del juego.
 * Cambiar un número aquí afecta todo el sistema de forma consistente.
 */

// ─── Milestones ───────────────────────────────────────────────────────────────

/** Días con recompensas especiales (duplican semillas + desbloqueos) */
export const MILESTONE_DAYS = [1, 3, 7, 14, 21, 30, 60, 90] as const
export type MilestoneDay = (typeof MILESTONE_DAYS)[number]

// ─── Racha ────────────────────────────────────────────────────────────────────

/**
 * La racha NO se rompe automáticamente por días sin registrar.
 * Solo se resetea con una recaída explícita.
 * Esto es una decisión de diseño emocional: el usuario controla su narrativa.
 */
export const STREAK_RULES = {
  /** ¿Se rompe la racha si el usuario no registra un día? */
  AUTO_BREAK_ON_MISSED_DAY: false,

  /** Días sin check-in antes de mostrar alerta suave (no penalty) */
  SOFT_REMINDER_DAYS: 2,

  /** El Gorrión del Amanecer nunca abandona el nido (ancla emocional) */
  PROTECTED_BIRD_ID: 'sparrow-dawn',
} as const

// ─── Economía de semillas ─────────────────────────────────────────────────────

/** Semillas base por check-in diario */
export const BASE_CHECKIN_SEEDS = 5

/**
 * Tiers de bonus por racha.
 * A mayor racha, más semillas por día de constancia.
 */
export const STREAK_SEED_TIERS = [
  { from: 0,  seedBonus: 0,  label: 'Inicio'       },
  { from: 7,  seedBonus: 3,  label: 'Creciendo'    },
  { from: 14, seedBonus: 5,  label: 'Arraigado'    },
  { from: 21, seedBonus: 8,  label: 'Fuerte'       },
  { from: 30, seedBonus: 12, label: 'Libre'        },
  { from: 60, seedBonus: 18, label: 'En vuelo'     },
] as const

/**
 * Recompensas especiales por alcanzar un milestone.
 * Estas REEMPLAZAN (no suman) la recompensa diaria normal.
 */
export const MILESTONE_REWARDS: Record<MilestoneDay, { seeds: number; food: number; gems: number }> = {
  1:  { seeds: 15,  food: 0,  gems: 0  },
  3:  { seeds: 22,  food: 1,  gems: 0  },
  7:  { seeds: 35,  food: 2,  gems: 0  },
  14: { seeds: 50,  food: 3,  gems: 1  },
  21: { seeds: 70,  food: 5,  gems: 1  },
  30: { seeds: 100, food: 8,  gems: 2  },
  60: { seeds: 150, food: 12, gems: 5  },
  90: { seeds: 250, food: 20, gems: 10 },
}

// ─── Resistencia a antojos ────────────────────────────────────────────────────

export const CRAVING_RULES = {
  /** Semillas base por resistir un antojo */
  BASE_SEEDS: 8,

  /** Gemas base por resistir un antojo */
  BASE_GEMS: 1,

  /** Máximo de veces que se puede reclamar la recompensa por antojo en un día */
  DAILY_LIMIT: 3,

  /** Bonus de semillas para rachas largas */
  STREAK_BONUS_TIERS: [
    { from: 0,  seeds: 8,  gems: 1 },
    { from: 7,  seeds: 12, gems: 1 },
    { from: 30, seeds: 18, gems: 2 },
  ] as const,
} as const

// ─── Hambre de aves ───────────────────────────────────────────────────────────

/**
 * Puntos de hambre que pierde cada ave por día sin ser alimentada.
 * Las aves raras necesitan más atención.
 */
export const HUNGER_DECAY_PER_DAY: Record<string, number> = {
  common:    6,
  uncommon:  8,
  rare:      10,
  legendary: 12,
}

export const HUNGER_THRESHOLDS = {
  /** Por encima de este nivel el ave está sana */
  HEALTHY:    60,

  /** Por debajo de este nivel el ave está enferma */
  SICK:       25,

  /** Al llegar a 0 el ave abandona temporalmente el nido */
  AWAY:       0,
} as const

/** Días de streak necesarios para que un ave 'away' vuelva como 'recovering' */
export const AWAY_BIRD_RETURN_STREAK = 3

// ─── Coste de alimentar aves ──────────────────────────────────────────────────

export const FEED_COST: Record<string, number> = {
  common:    2,
  uncommon:  3,
  rare:      5,
  legendary: 8,
}

// ─── Fases de usuario ─────────────────────────────────────────────────────────

/**
 * Fases emocionales del usuario basadas en racha actual.
 * Se usan para mensajes, UI y desbloqueos narrativos.
 */
export const USER_PHASES = [
  {
    id:          'spark',
    label:       'Primer destello',
    minDays:     0,
    maxDays:     6,
    description: 'El comienzo es el momento más valioso. Día a día.',
    biome:       'meadow',
  },
  {
    id:          'growing',
    label:       'Echando raíces',
    minDays:     7,
    maxDays:     20,
    description: 'Tu cuerpo ya nota la diferencia. El nido se llena.',
    biome:       'forest',
  },
  {
    id:          'rooted',
    label:       'Bien arraigado',
    minDays:     21,
    maxDays:     59,
    description: 'El hábito nuevo está tomando forma. Eres más fuerte.',
    biome:       'valley',
  },
  {
    id:          'soaring',
    label:       'En pleno vuelo',
    minDays:     60,
    maxDays:     Infinity,
    description: 'Eres libre. Tu nido es un ecosistema completo.',
    biome:       'sky',
  },
] as const

export type UserPhaseId = (typeof USER_PHASES)[number]['id']
