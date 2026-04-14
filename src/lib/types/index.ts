// ─── User ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string
  name: string
  quitDate: string          // ISO date string  "YYYY-MM-DD"
  cigarettesPerDay: number
  pricePerPack: number      // local currency
  cigarettesPerPack: number
  motivation: string
  createdAt: string         // ISO timestamp
}

// ─── Birds ───────────────────────────────────────────────────────────────────

export type BirdStatus   = 'locked' | 'healthy' | 'sick' | 'away' | 'recovering'
export type BirdRarity   = 'common' | 'uncommon' | 'rare' | 'legendary'

export interface Bird {
  id: string
  name: string
  species: string
  description: string
  lore: string
  rarity: BirdRarity
  unlockDays: number                         // smoke-free days required
  /** Bioma de origen — afecta visibilidad y animación en el hábitat */
  homeBiome: BiomeId
  emoji: string
  color: string                              // hex for sprite tint
  /** Posición por defecto (override por slot del bioma en runtime) */
  habitatPosition: { x: number; y: number }
  status: BirdStatus
  hungerLevel: number                        // 0-100
  lastFed: string | null                     // ISO date
  unlockedDate: string | null                // ISO date
  feedCost: number                           // seeds required
}

// ─── Biomes ──────────────────────────────────────────────────────────────────

export type BiomeId = 'meadow' | 'forest' | 'valley' | 'sky'

export interface Biome {
  id: BiomeId
  name: string
  description: string
  unlockDays: number
  skyGradient: [string, string]
  groundColor: string
  accentColor: string
  treeColor: string
}

// ─── Resources ───────────────────────────────────────────────────────────────

export interface Resources {
  /** Moneda principal — se ganan cada día de check-in */
  seeds: number
  /** Recurso escaso — solo en milestones y rachas largas */
  food: number
  /** Recurso rarísimo — antojos resistidos + rachas muy largas */
  gems: number
}

// ─── Achievements ────────────────────────────────────────────────────────────

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockDays: number
  unlocked: boolean
  unlockedDate: string | null
}

// ─── Journal ─────────────────────────────────────────────────────────────────

export type DayEntryType = 'smoke_free' | 'relapse' | 'craving_resisted'

export interface DayEntry {
  id: string
  date: string                     // "YYYY-MM-DD"
  type: DayEntryType
  note?: string
  rewardsEarned?: Partial<Resources>
  streakAtTime: number
}

// ─── Streak (compatible con engine/types StreakState) ─────────────────────────

/**
 * @deprecated Usar StreakState de @/lib/engine/types para la lógica del juego.
 * Este alias se mantiene para compatibilidad con el store hasta migración completa.
 */
export interface StreakData {
  currentStreak: number
  longestStreak: number
  totalSmokeFree: number
  lastCheckInDate: string | null
  todayCheckedIn: boolean
}

// ─── Action results (devueltos por acciones del store para feedback en UI) ────

export interface CheckInResult {
  newStreak: number
  rewards: Partial<Resources>
  newBirdsUnlocked: Bird[]
  newAchievements: Achievement[]
  isMilestone: boolean
  biomeChanged: boolean
  newBiomeId: BiomeId | null
}

export interface RelapseResult {
  birdLeft: Bird | null
  birdSick: Bird | null
  streakLost: number
}

// ─── Full store shape ─────────────────────────────────────────────────────────

export interface NidoState {
  user: UserProfile | null
  isOnboarded: boolean
  streak: StreakData
  birds: Bird[]
  resources: Resources
  achievements: Achievement[]
  journal: DayEntry[]
  currentBiomeId: BiomeId
}
