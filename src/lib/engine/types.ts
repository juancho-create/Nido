/**
 * NIDO — ENGINE TYPES
 * ──────────────────────────────────────────────────────────────────────────────
 * Tipos específicos del engine de juego. Extienden los tipos base de
 * src/lib/types/index.ts sin duplicarlos.
 */

import type { BiomeId, BirdRarity, BirdStatus, Resources } from '@/lib/types'
import type { UserPhaseId, MilestoneDay } from './constants'

// ─── Fase de usuario ──────────────────────────────────────────────────────────

export interface UserPhase {
  id: UserPhaseId
  label: string
  minDays: number
  maxDays: number
  description: string
  biome: BiomeId
}

// ─── Racha extendida ──────────────────────────────────────────────────────────

/**
 * Estado completo de la racha.
 * Reemplaza el StreakData básico del store — tiene todos los campos
 * necesarios para que el engine tome decisiones sin consultar otras partes.
 */
export interface StreakState {
  current: number              // días consecutivos sin fumar
  longest: number              // mejor racha histórica
  totalSmokeFree: number       // total de días sin fumar (nunca decrece)
  lastCheckInDate: string | null  // "YYYY-MM-DD"
  todayCheckedIn: boolean
  frozenStreak: number | null  // racha justo antes de la última recaída
  relapseCount: number         // total de recaídas (no punitivo, solo info)
  cravingsResistedTotal: number
  cravingsResistedToday: number  // se resetea en cada check-in
}

// ─── Slot de hábitat ─────────────────────────────────────────────────────────

/**
 * Posición de un ave en la escena del hábitat.
 * Las posiciones son porcentajes (0-100) sobre el canvas del bioma.
 * layer afecta velocidad de animación: sky > midground > foreground.
 */
export interface BirdSlot {
  x: number
  y: number
  layer: 'foreground' | 'midground' | 'sky'
}

// ─── Configuración de bioma ───────────────────────────────────────────────────

/**
 * Define cuántos slots de aves tiene cada bioma y sus posiciones exactas.
 * A más días de racha, más slots se abren.
 */
export interface BiomeConfig {
  id: BiomeId
  unlocksAt: number
  maxVisibleBirds: number
  slots: BirdSlot[]
}

// ─── Estado de ave extendido ──────────────────────────────────────────────────

/**
 * Metadata de una ave que el engine necesita para cálculos.
 * Se combina con la definición estática (Bird) del catálogo.
 */
export interface BirdLiveState {
  id: string
  status: BirdStatus
  hungerLevel: number        // 0-100
  lastFedDate: string | null // "YYYY-MM-DD"
  unlockedDate: string | null
  feedCount: number          // total de veces alimentada
  homeBiome: BiomeId         // bioma de origen (afecta visibilidad)
  rarity: BirdRarity
}

// ─── Resultados de acciones ───────────────────────────────────────────────────

export interface CheckInReward {
  seeds: number
  food: number
  gems: number
  isMilestone: boolean
  milestone: MilestoneDay | null
}

export interface CravingReward {
  seeds: number
  gems: number
  /** null si se superó el límite diario */
  blocked: boolean
}

// ─── Eventos del juego (event log) ────────────────────────────────────────────

/**
 * Registro inmutable de lo que ocurrió.
 * Útil para analytics, historial, y futura sincronización con Supabase.
 */
export type GameEvent =
  | {
      type: 'CHECK_IN'
      date: string
      note?: string
      newStreak: number
      reward: CheckInReward
    }
  | {
      type: 'RELAPSE'
      date: string
      note?: string
      streakLost: number
      birdLeftId: string | null
      birdSickId: string | null
    }
  | {
      type: 'CRAVING_RESISTED'
      date: string
      reward: Omit<CravingReward, 'blocked'>
      cravingsToday: number
    }
  | {
      type: 'BIRD_FED'
      date: string
      birdId: string
      seedsSpent: number
      wasRecovery: boolean
    }
  | {
      type: 'BIRD_UNLOCKED'
      date: string
      birdId: string
      streakAtUnlock: number
    }
  | {
      type: 'ACHIEVEMENT_UNLOCKED'
      date: string
      achievementId: string
    }
  | {
      type: 'BIOME_UPGRADED'
      date: string
      fromBiome: BiomeId
      toBiome: BiomeId
    }

// ─── Snapshot completo del estado del juego ───────────────────────────────────

/**
 * Lo que se necesita para renderizar cualquier pantalla de la app.
 * El store devuelve un objeto con esta forma (derivado).
 */
export interface GameSnapshot {
  phase: UserPhase
  streak: StreakState
  resources: Resources
  biomeId: BiomeId
  visibleBirdIds: string[]        // ids en orden de slots del bioma actual
  nextMilestone: MilestoneDay | null
  daysToNextMilestone: number | null
  nextBirdUnlockDays: number | null  // días hasta el próximo ave bloqueada
  moneySaved: number
  cigarettesNotSmoked: number
}
