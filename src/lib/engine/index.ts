/**
 * NIDO ENGINE — Barrel export
 * ──────────────────────────────────────────────────────────────────────────────
 * Importa desde aquí para acceder a cualquier función del engine:
 *
 *   import { calcCheckInReward, applyCheckIn, getBiomeId } from '@/lib/engine'
 */

// ── Constants ─────────────────────────────────────────────────────────────────
export {
  MILESTONE_DAYS,
  MILESTONE_REWARDS,
  STREAK_SEED_TIERS,
  STREAK_RULES,
  USER_PHASES,
  CRAVING_RULES,
  HUNGER_DECAY_PER_DAY,
  HUNGER_THRESHOLDS,
  FEED_COST,
  AWAY_BIRD_RETURN_STREAK,
  BASE_CHECKIN_SEEDS,
  type MilestoneDay,
  type UserPhaseId,
} from './constants'

// ── Engine types ──────────────────────────────────────────────────────────────
export type {
  UserPhase,
  StreakState,
  BirdSlot,
  BiomeConfig,
  BirdLiveState,
  CheckInReward,
  CravingReward,
  GameEvent,
  GameSnapshot,
} from './types'

// ── Streak ────────────────────────────────────────────────────────────────────
export {
  getUserPhase,
  getUserPhaseId,
  isMilestone,
  nextMilestone,
  daysToNextMilestone,
  getMilestoneProgress,
  canCheckIn,
  daysSinceLastCheckIn,
  shouldShowSoftReminder,
  applyCheckIn,
  applyRelapse,
  applyCravingResisted,
  resetDailyFlags,
  streakLabel,
  streakProgressPercent,
  INITIAL_STREAK_STATE,
  STREAK_EXAMPLES,
} from './streak'

// ── Seeds / Economía ──────────────────────────────────────────────────────────
export {
  getStreakTier,
  baseCheckInSeeds,
  calcCheckInReward,
  calcCravingReward,
  addResources,
  spendSeedsForFeed,
  canAffordFeed,
  projectSeeds,
  calcMoneySaved,
  calcCigarettesNotSmoked,
  calcLifeMinutesGained,
  INITIAL_RESOURCES,
  REWARD_TABLE,
} from './seeds'

// ── Birds ─────────────────────────────────────────────────────────────────────
export {
  calcCurrentHunger,
  birdStatusFromHunger,
  updateBirdHunger,
  applyFeedBird,
  getFeedCost,
  getBirdsToUnlock,
  getBirdsReturning,
  getBirdsRecovering,
  applyBirdsOnCheckIn,
  selectRelapseTargets,
  applyBirdsOnRelapse,
  getActiveBirds,
  getBirdsNeedingCare,
  hasUrgentCare,
  habitatHealthPercent,
  getNextBirdToUnlock,
} from './birds'

// ── Biomes ────────────────────────────────────────────────────────────────────
export {
  BIOME_CONFIGS,
  getBiomeId,
  didBiomeChange,
  getBiomeConfig,
  assignBirdsToSlots,
  isBirdNativeToCurrentBiome,
  animClassForLayer,
  scaleForLayer,
  getBiomeProgressList,
} from './biomes'

// ── Relapse ───────────────────────────────────────────────────────────────────
export {
  computeRelapseOutcome,
  computeRelapseStats,
  type RelapseOutcome,
  type RelapseStats,
} from './relapse'
