'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils/cn'
import type { Bird, BirdRarity } from '@/lib/types'
import { BirdDetailModal } from './BirdDetailModal'

interface BirdCardProps {
  bird: Bird
  onFeed?: (id: string) => void
  canFeed?: boolean
}

const RARITY_LABELS: Record<BirdRarity, string> = {
  common:    'Común',
  uncommon:  'Poco común',
  rare:      'Raro',
  legendary: 'Legendario',
}

const RARITY_COLORS: Record<BirdRarity, string> = {
  common:    'border-nido-sage/20 bg-white/60',
  uncommon:  'border-blue-200/60 bg-blue-50/40',
  rare:      'border-purple-200/60 bg-purple-50/40',
  legendary: 'border-amber-200/60 bg-amber-50/40',
}

export function BirdCard({ bird, onFeed, canFeed }: BirdCardProps) {
  const [detailOpen, setDetailOpen] = useState(false)
  const isLocked = bird.status === 'locked'

  return (
    <>
      <button
        className={cn(
          'relative w-full rounded-3xl border backdrop-blur-sm p-4 text-left',
          'transition-all duration-200 active:scale-95',
          isLocked
            ? 'border-gray-100 bg-gray-50/60 opacity-70'
            : RARITY_COLORS[bird.rarity],
        )}
        onClick={() => setDetailOpen(true)}
      >
        {/* Bird emoji + status */}
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <span
              className={cn('text-4xl leading-none block', {
                'grayscale opacity-30': isLocked,
                'grayscale': bird.status === 'sick',
                'opacity-40': bird.status === 'away',
              })}
            >
              {isLocked ? '🔒' : bird.emoji}
            </span>
            {!isLocked && (
              <StatusDot status={bird.status} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className={cn('text-sm font-semibold truncate', isLocked ? 'text-gray-400' : 'text-nido-dusk')}>
                {isLocked ? `Desbloquea en día ${bird.unlockDays}` : bird.name}
              </p>
            </div>

            {!isLocked && (
              <p className="text-xs text-nido-dusk/50 italic mt-0.5">{bird.species}</p>
            )}

            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <Badge variant={bird.rarity}>{RARITY_LABELS[bird.rarity]}</Badge>
              {!isLocked && <Badge variant={bird.status as any}>{statusLabel(bird.status)}</Badge>}
            </div>
          </div>
        </div>

        {/* Hunger bar */}
        {!isLocked && bird.status !== 'away' && (
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-[10px] text-nido-dusk/40">
              <span>Hambre</span>
              <span>{bird.hungerLevel}%</span>
            </div>
            <Progress
              value={bird.hungerLevel}
              indicatorClassName={
                bird.hungerLevel < 30
                  ? 'bg-red-400'
                  : bird.hungerLevel < 60
                  ? 'bg-nido-amber'
                  : 'bg-nido-sage'
              }
            />
          </div>
        )}

        {/* Feed button */}
        {!isLocked && canFeed && bird.status !== 'away' && bird.status !== 'locked' && (
          <Button
            variant="outline"
            size="sm"
            className="mt-3 w-full text-xs"
            onClick={(e) => {
              e.stopPropagation()
              onFeed?.(bird.id)
            }}
          >
            Alimentar 🌱 {bird.feedCost}
          </Button>
        )}

        {/* Lock overlay — unlock day hint */}
        {isLocked && (
          <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
            <span>🔒</span>
            <span>Día {bird.unlockDays} sin fumar</span>
          </div>
        )}
      </button>

      <BirdDetailModal
        bird={bird}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onFeed={onFeed}
        canFeed={canFeed}
      />
    </>
  )
}

function StatusDot({ status }: { status: Bird['status'] }) {
  return (
    <span
      className={cn(
        'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white',
        {
          'bg-green-400':  status === 'healthy',
          'bg-red-400':    status === 'sick',
          'bg-gray-300':   status === 'away',
          'bg-yellow-400': status === 'recovering',
        },
      )}
    />
  )
}

function statusLabel(status: Bird['status']): string {
  const map: Record<Bird['status'], string> = {
    healthy:    'Sano',
    sick:       'Enfermo',
    away:       'Ausente',
    recovering: 'Mejorando',
    locked:     'Bloqueado',
  }
  return map[status]
}
