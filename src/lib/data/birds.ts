import type { Bird } from '@/lib/types'

/**
 * Catálogo completo de aves de Nido.
 *
 * Reglas de diseño del catálogo:
 * - homeBiome: bioma donde el ave "vive" (afecta animación y visibilidad máxima)
 * - unlockDays coincide con el bioma de aparición para reforzar la narrativa
 * - Las legendarias requieren bioma 'sky' o 'valley' tardío
 * - feedCost = 2 (common) / 3 (uncommon) / 5 (rare) / 8 (legendary)
 * - habitatPosition es la posición fallback si no hay slot asignado por bioma
 */
export const INITIAL_BIRDS: Bird[] = [
  // ── COMMON ──────────────────────────────────────────────────────────────────

  {
    id:              'sparrow-dawn',
    name:            'Gorrión del Amanecer',
    species:         'Passer aureus',
    description:     'El primero en llegar. Pequeño, dorado, lleno de esperanza.',
    lore:            'Dicen que este gorrión aparece cada vez que alguien toma una decisión valiente. Llegó el día que decidiste cuidarte.',
    rarity:          'common',
    unlockDays:      0,
    homeBiome:       'meadow',
    emoji:           '🐦',
    color:           '#C4956A',
    habitatPosition: { x: 28, y: 58 },
    status:          'healthy',
    hungerLevel:     80,
    lastFed:         null,
    unlockedDate:    null,
    feedCost:        2,
  },

  {
    id:              'robin-hope',
    name:            'Petirrojo Esperanza',
    species:         'Erithacus spei',
    description:     'Su pecho rojo es una llama que no se apaga.',
    lore:            'El Petirrojo Esperanza canta más fuerte cuando más frío hace. Símbolo de persistencia que aparece al tercer día.',
    rarity:          'common',
    unlockDays:      3,
    homeBiome:       'meadow',
    emoji:           '🐦',
    color:           '#E07B54',
    habitatPosition: { x: 68, y: 52 },
    status:          'locked',
    hungerLevel:     100,
    lastFed:         null,
    unlockedDate:    null,
    feedCost:        2,
  },

  // ── UNCOMMON ────────────────────────────────────────────────────────────────

  {
    id:              'hummingbird-pulse',
    name:            'Colibrí Pulso',
    species:         'Trochilus vitae',
    description:     'Vibra con la energía de siete días de libertad.',
    lore:            'Sus alas baten 70 veces por segundo, como tu corazón cuando decides no rendirte.',
    rarity:          'uncommon',
    unlockDays:      7,
    homeBiome:       'forest',
    emoji:           '🦜',
    color:           '#5B9E6E',
    habitatPosition: { x: 50, y: 38 },
    status:          'locked',
    hungerLevel:     100,
    lastFed:         null,
    unlockedDate:    null,
    feedCost:        3,
  },

  {
    id:              'blackbird-silence',
    name:            'Mirlo del Silencio',
    species:         'Turdus quietus',
    description:     'Aprecia los silencios donde antes había humo.',
    lore:            'Canta en la oscuridad para que no temas a los momentos vacíos. Llega a los 14 días.',
    rarity:          'uncommon',
    unlockDays:      14,
    homeBiome:       'forest',
    emoji:           '🐦',
    color:           '#2C3E50',
    habitatPosition: { x: 18, y: 48 },
    status:          'locked',
    hungerLevel:     100,
    lastFed:         null,
    unlockedDate:    null,
    feedCost:        3,
  },

  // ── RARE ────────────────────────────────────────────────────────────────────

  {
    id:              'swallow-free',
    name:            'Golondrina Libre',
    species:         'Hirundo libertas',
    description:     'Vuela sin cadenas. Aparece a los 21 días.',
    lore:            'Las golondrinas viajan miles de kilómetros sin brújula. Solo siguen algo interior: sigue.',
    rarity:          'rare',
    unlockDays:      21,
    homeBiome:       'valley',
    emoji:           '🕊️',
    color:           '#7B9E84',
    habitatPosition: { x: 78, y: 32 },
    status:          'locked',
    hungerLevel:     100,
    lastFed:         null,
    unlockedDate:    null,
    feedCost:        5,
  },

  {
    id:              'sunbird',
    name:            'Pájaro del Sol',
    species:         'Nectarinia solaris',
    description:     'Piel dorada como el amanecer de un mes nuevo.',
    lore:            'Nace del color del sol de mediodía. Solo visita a quienes han completado un ciclo entero: 30 días.',
    rarity:          'rare',
    unlockDays:      30,
    homeBiome:       'sky',
    emoji:           '✨',
    color:           '#F4C430',
    habitatPosition: { x: 55, y: 28 },
    status:          'locked',
    hungerLevel:     100,
    lastFed:         null,
    unlockedDate:    null,
    feedCost:        5,
  },

  // ── LEGENDARY ───────────────────────────────────────────────────────────────

  {
    id:              'phoenix-reborn',
    name:            'Fénix del Renacer',
    species:         'Phoenix renovatus',
    description:     'Legendario. Dos meses de constancia invocan al Fénix.',
    lore:            'No es el ave que nunca cae. Es el que siempre se levanta. Como tú.',
    rarity:          'legendary',
    unlockDays:      60,
    homeBiome:       'sky',
    emoji:           '🔥',
    color:           '#FF6B35',
    habitatPosition: { x: 42, y: 22 },
    status:          'locked',
    hungerLevel:     100,
    lastFed:         null,
    unlockedDate:    null,
    feedCost:        8,
  },

  {
    id:              'eagle-serene',
    name:            'Águila Serena',
    species:         'Aquila tranquillitas',
    description:     'Noventa días. La cima. El guardián del Nido.',
    lore:            'El Águila Serena vuela más alto que el humo de cualquier ciudad. Lleva tu nombre grabado en sus alas.',
    rarity:          'legendary',
    unlockDays:      90,
    homeBiome:       'sky',
    emoji:           '🦅',
    color:           '#4A7C59',
    habitatPosition: { x: 82, y: 18 },
    status:          'locked',
    hungerLevel:     100,
    lastFed:         null,
    unlockedDate:    null,
    feedCost:        8,
  },
]
