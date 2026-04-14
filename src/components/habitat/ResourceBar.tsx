'use client'

import { GlassCard } from '@/components/shared/GlassCard'
import type { Resources } from '@/lib/types'

interface ResourceBarProps {
  resources: Resources
  streak: number
}

export function ResourceBar({ resources, streak }: ResourceBarProps) {
  return (
    <GlassCard intensity="heavy" padding="sm" className="mx-4 mt-3 flex items-center justify-between">
      <StreakPill streak={streak} />
      <div className="flex items-center gap-3">
        <Resource icon="🌱" value={resources.seeds} label="semillas" />
        <Resource icon="🍎" value={resources.food}  label="comida"   />
        <Resource icon="💎" value={resources.gems}  label="gemas"    />
      </div>
    </GlassCard>
  )
}

function StreakPill({ streak }: { streak: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xl leading-none">🔥</span>
      <div>
        <p className="text-lg font-bold text-nido-dusk leading-none">{streak}</p>
        <p className="text-[9px] text-nido-dusk/50 uppercase tracking-wide">
          {streak === 1 ? 'día' : 'días'}
        </p>
      </div>
    </div>
  )
}

function Resource({
  icon, value, label,
}: {
  icon: string; value: number; label: string
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-base leading-none">{icon}</span>
      <span className="text-sm font-semibold text-nido-dusk">{value}</span>
    </div>
  )
}
