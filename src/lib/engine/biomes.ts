/**
 * NIDO — BIOME ENGINE
 * ──────────────────────────────────────────────────────────────────────────────
 * Reglas de aparición y visibilidad de aves según el bioma actual.
 *
 * Filosofía de diseño:
 *   - Cada bioma tiene un número máximo de SLOTS visuales para aves.
 *   - A más streak → más slots → más aves visibles en pantalla.
 *   - Las aves se asignan a slots en orden de desbloqueo.
 *   - Cada slot tiene una capa (layer) que afecta la animación y profundidad.
 *   - Las aves con 'homeBiome' coincidente con el bioma actual brillan más.
 *
 * Reglas de aparición por bioma:
 *
 *   MEADOW  (día 0-6)   → 2 slots, capa foreground
 *   FOREST  (día 7-20)  → 4 slots, foreground + midground
 *   VALLEY  (día 21-29) → 6 slots, foreground + midground + sky bajo
 *   SKY     (día 30+)   → 8 slots, todos los layers
 */

import type { Bird, BiomeId } from '@/lib/types'
import type { BiomeConfig, BirdSlot } from './types'

// ─── Configuración de biomas ──────────────────────────────────────────────────

/**
 * Slots por bioma.
 * Las posiciones (x, y) son porcentajes sobre el canvas del hábitat.
 * layer afecta:
 *   - velocidad de animación: foreground > midground > sky (más rápido a más cercano)
 *   - z-index visual
 *   - escala del sprite
 */
export const BIOME_CONFIGS: Record<BiomeId, BiomeConfig> = {
  meadow: {
    id:              'meadow',
    unlocksAt:       0,
    maxVisibleBirds: 2,
    slots: [
      { x: 28, y: 58, layer: 'foreground' },
      { x: 68, y: 52, layer: 'foreground' },
    ],
  },

  forest: {
    id:              'forest',
    unlocksAt:       7,
    maxVisibleBirds: 4,
    slots: [
      { x: 28, y: 58, layer: 'foreground' },  // sparrow — ancla baja izquierda
      { x: 68, y: 52, layer: 'foreground' },  // robin  — baja derecha
      { x: 50, y: 38, layer: 'midground'  },  // hummingbird — centro medio
      { x: 18, y: 48, layer: 'foreground' },  // blackbird — baja lejos izquierda
    ],
  },

  valley: {
    id:              'valley',
    unlocksAt:       21,
    maxVisibleBirds: 6,
    slots: [
      { x: 28, y: 58, layer: 'foreground' },
      { x: 68, y: 52, layer: 'foreground' },
      { x: 50, y: 38, layer: 'midground'  },
      { x: 18, y: 48, layer: 'foreground' },
      { x: 78, y: 32, layer: 'midground'  },  // swallow — medio derecha
      { x: 55, y: 28, layer: 'sky'        },  // sunbird  — altura baja del cielo
    ],
  },

  sky: {
    id:              'sky',
    unlocksAt:       30,
    maxVisibleBirds: 8,
    slots: [
      { x: 28, y: 58, layer: 'foreground' },
      { x: 68, y: 52, layer: 'foreground' },
      { x: 50, y: 38, layer: 'midground'  },
      { x: 18, y: 48, layer: 'foreground' },
      { x: 78, y: 32, layer: 'midground'  },
      { x: 55, y: 28, layer: 'sky'        },
      { x: 42, y: 22, layer: 'sky'        },  // phoenix — cielo medio
      { x: 82, y: 18, layer: 'sky'        },  // eagle   — cielo alto derecha
    ],
  },
}

// ─── Selección de bioma ───────────────────────────────────────────────────────

/**
 * Determina el BiomeId correcto para una racha dada.
 *
 * @example
 * getBiomeId(0)   // 'meadow'
 * getBiomeId(6)   // 'meadow'
 * getBiomeId(7)   // 'forest'
 * getBiomeId(21)  // 'valley'
 * getBiomeId(30)  // 'sky'
 */
export function getBiomeId(streak: number): BiomeId {
  if (streak >= 30) return 'sky'
  if (streak >= 21) return 'valley'
  if (streak >= 7)  return 'forest'
  return 'meadow'
}

/** ¿Cambió el bioma al pasar de oldStreak a newStreak? */
export function didBiomeChange(oldStreak: number, newStreak: number): boolean {
  return getBiomeId(oldStreak) !== getBiomeId(newStreak)
}

export function getBiomeConfig(biomeId: BiomeId): BiomeConfig {
  return BIOME_CONFIGS[biomeId]
}

// ─── Asignación de aves a slots ───────────────────────────────────────────────

/**
 * Determina qué aves se muestran en el hábitat y en qué slot.
 *
 * Reglas:
 * 1. Solo aves no-locked.
 * 2. Máximo = maxVisibleBirds del bioma actual.
 * 3. Las aves se ordenan por fecha de desbloqueo (o por unlockDays como fallback).
 * 4. Las aves 'away' SIGUEN ocupando su slot (se ven translúcidas, no desaparecen).
 *
 * @returns Array de { bird, slot } con la longitud mínima entre aves activas y slots.
 */
export function assignBirdsToSlots(
  birds: Bird[],
  biomeId: BiomeId,
): Array<{ bird: Bird; slot: BirdSlot }> {
  const config = BIOME_CONFIGS[biomeId]

  const activeBirds = birds
    .filter((b) => b.status !== 'locked')
    .sort((a, b) => {
      // Ordenar por fecha de desbloqueo si existe, si no por unlockDays
      if (a.unlockedDate && b.unlockedDate) {
        return a.unlockedDate.localeCompare(b.unlockedDate)
      }
      return a.unlockDays - b.unlockDays
    })
    .slice(0, config.maxVisibleBirds)

  return activeBirds.map((bird, i) => ({
    bird,
    slot: config.slots[i],
  }))
}

/**
 * ¿Es esta ave "nativa" del bioma actual?
 * Las aves nativas tienen una animación más viva y un aura sutil.
 *
 * Un ave es nativa si su bioma de origen (homeBiome) coincide con el actual.
 */
export function isBirdNativeToCurrentBiome(
  bird: Bird & { homeBiome?: BiomeId },
  currentBiomeId: BiomeId,
): boolean {
  return bird.homeBiome === currentBiomeId
}

// ─── Animación por layer ──────────────────────────────────────────────────────

/**
 * Clase de animación Tailwind según el layer del slot.
 * Más cercano al frente → animación más rápida (sensación de profundidad).
 */
export function animClassForLayer(layer: BirdSlot['layer']): string {
  switch (layer) {
    case 'foreground': return 'animate-float-fast'
    case 'midground':  return 'animate-float'
    case 'sky':        return 'animate-float-slow'
  }
}

/**
 * Escala visual del sprite según el layer (perspectiva).
 * foreground > midground > sky
 */
export function scaleForLayer(layer: BirdSlot['layer']): number {
  switch (layer) {
    case 'foreground': return 1.0
    case 'midground':  return 0.85
    case 'sky':        return 0.70
  }
}

// ─── Progresión de bioma ──────────────────────────────────────────────────────

/**
 * Todos los biomas ordenados con su estado (desbloqueado / pendiente).
 */
export function getBiomeProgressList(
  currentStreak: number,
): Array<{
  id: BiomeId
  unlocksAt: number
  unlocked: boolean
  isCurrent: boolean
}> {
  const order: BiomeId[] = ['meadow', 'forest', 'valley', 'sky']
  const currentId = getBiomeId(currentStreak)

  return order.map((id) => ({
    id,
    unlocksAt: BIOME_CONFIGS[id].unlocksAt,
    unlocked:  currentStreak >= BIOME_CONFIGS[id].unlocksAt,
    isCurrent: id === currentId,
  }))
}
