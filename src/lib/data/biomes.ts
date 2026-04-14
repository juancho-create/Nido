import type { Biome } from '@/lib/types'

export const BIOMES: Biome[] = [
  {
    id: 'meadow',
    name: 'Prado del Comienzo',
    description: 'Donde todo inicia. Aire fresco, luz suave.',
    unlockDays: 0,
    skyGradient: ['#B8D4E8', '#E8F4F8'],
    groundColor: '#7B9E84',
    accentColor: '#A8C4A8',
    treeColor: '#5E8B5F',
  },
  {
    id: 'forest',
    name: 'Bosque de la Calma',
    description: 'Los árboles crecen con tu fortaleza.',
    unlockDays: 7,
    skyGradient: ['#6B9B6B', '#A8C4A8'],
    groundColor: '#4A7C59',
    accentColor: '#5E8B5F',
    treeColor: '#3D6B4A',
  },
  {
    id: 'valley',
    name: 'Valle Luminoso',
    description: 'La luz de tres semanas te calienta.',
    unlockDays: 21,
    skyGradient: ['#F9D876', '#FFE4A0'],
    groundColor: '#8B7355',
    accentColor: '#C4955A',
    treeColor: '#6B4E3D',
  },
  {
    id: 'sky',
    name: 'Cielos Abiertos',
    description: 'Un mes completo te eleva hasta las nubes.',
    unlockDays: 30,
    skyGradient: ['#4A90D9', '#87CEEB'],
    groundColor: '#FFFFFF',
    accentColor: '#B8D4E8',
    treeColor: '#87CEEB',
  },
]

export function getBiomeForStreak(days: number): Biome {
  const sorted = [...BIOMES].sort((a, b) => b.unlockDays - a.unlockDays)
  return sorted.find((b) => days >= b.unlockDays) ?? BIOMES[0]
}
