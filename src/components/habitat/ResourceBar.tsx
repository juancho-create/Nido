'use client'

import { cn } from '@/lib/utils/cn'
import type { Resources } from '@/lib/types'

interface ResourceBarProps {
  resources: Resources
  streak:    number
}

export function ResourceBar({ resources, streak }: ResourceBarProps) {
  return (
    <div className="mx-4 mt-3">
      <div className="rounded-2xl bg-white/70 border border-white/75 shadow-glass backdrop-blur-sm px-4 py-3 flex items-center justify-between">
        <StreakPill streak={streak} />

        <div className="h-6 w-px bg-nido-dusk/10 mx-2" />

        <div className="flex items-center gap-3.5">
          <ResourceChip icon="🌱" value={resources.seeds} />
          <ResourceChip icon="🍎" value={resources.food}  />
          <ResourceChip icon="💎" value={resources.gems}  />
        </div>
      </div>
    </div>
  )
}

function StreakPill({ streak }: { streak: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        'w-9 h-9 rounded-xl flex items-center justify-center',
        streak > 0 ? 'bg-nido-amber/12' : 'bg-nido-dusk/6',
      )}>
        <span className="text-lg leading-none">
          {streak > 0 ? '🔥' : '🌿'}
        </span>
      </div>
      <div>
        <p className="text-lg font-bold text-nido-dusk leading-none">{streak}</p>
        <p className="text-[9px] text-nido-dusk/40 uppercase tracking-wide leading-none mt-0.5">
          {streak === 1 ? 'día' : 'días'}
        </p>
      </div>
    </div>
  )
}

function ResourceChip({ icon, value }: { icon: string; value: number }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-base leading-none">{icon}</span>
      <span className="text-sm font-semibold text-nido-dusk/80">{value}</span>
    </div>
  )
}
