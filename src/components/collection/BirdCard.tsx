'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils/cn'
import type { Bird, BirdRarity } from '@/lib/types'
import { BirdDetailModal } from './BirdDetailModal'

interface BirdCardProps {
  bird:     Bird
  onFeed?:  (id: string) => void
  canFeed?: boolean
}

const RARITY_LABELS: Record<BirdRarity, string> = {
  common:    'Común',
  uncommon:  'Poco común',
  rare:      'Raro',
  legendary: 'Legendario',
}

// Card background + border for each rarity
const RARITY_CARD: Record<BirdRarity, string> = {
  common:    'bg-white/70 border-nido-sage/18',
  uncommon:  'bg-blue-50/60 border-blue-200/40',
  rare:      'bg-purple-50/60 border-purple-200/40',
  legendary: 'bg-amber-50/70 border-nido-gold/35',
}

// Emoji container tint
const RARITY_ICON_BG: Record<BirdRarity, string> = {
  common:    'bg-nido-sage/10',
  uncommon:  'bg-blue-100/60',
  rare:      'bg-purple-100/60',
  legendary: 'bg-nido-gold/18',
}

// Ring glow around the emoji
const RARITY_RING: Record<BirdRarity, string> = {
  common:    'ring-2 ring-nido-sage/20',
  uncommon:  'ring-2 ring-blue-300/35',
  rare:      'ring-2 ring-purple-300/40',
  legendary: 'ring-2 ring-nido-gold/50 shadow-gold-glow',
}

// Hunger bar colour
function hungerColor(level: number) {
  if (level < 30) return 'bg-red-400'
  if (level < 60) return 'bg-nido-amber'
  return 'bg-nido-sage'
}

export function BirdCard({ bird, onFeed, canFeed }: BirdCardProps) {
  const [detailOpen, setDetailOpen] = useState(false)
  const isLocked = bird.status === 'locked'

  return (
    <>
      <button
        className={cn(
          'relative w-full rounded-3xl border backdrop-blur-sm p-4 text-left',
          'transition-all duration-200 active:scale-[0.97]',
          'shadow-card hover:shadow-card-hover',
          isLocked
            ? 'bg-nido-mist/50 border-nido-dusk/8 opacity-75'
            : RARITY_CARD[bird.rarity],
        )}
        onClick={() => !isLocked && setDetailOpen(true)}
      >
        {/* Legendary shimmer strip */}
        {!isLocked && bird.rarity === 'legendary' && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none"
          >
            <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nido-gold/60 to-transparent" />
          </span>
        )}

        <div className="flex items-start gap-3.5">
          {/* Emoji + status ring */}
          <div className="relative flex-shrink-0">
            <div
              className={cn(
                'w-14 h-14 rounded-2xl flex items-center justify-center text-3xl',
                'transition-all duration-200',
                isLocked ? 'bg-nido-dusk/8' : RARITY_ICON_BG[bird.rarity],
                !isLocked && RARITY_RING[bird.rarity],
              )}
            >
              <span
                className={cn({
                  'grayscale opacity-25': isLocked,
                  'grayscale opacity-70': bird.status === 'sick',
                  'opacity-35':           bird.status === 'away',
                  'animate-float-slow':   !isLocked && bird.status === 'healthy' && bird.rarity === 'legendary',
                })}
              >
                {isLocked ? '🪹' : bird.emoji}
              </span>
            </div>

            {!isLocked && <StatusDot status={bird.status} />}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-0.5">
            {isLocked ? (
              <>
                <p className="text-sm font-semibold text-nido-dusk/40">
                  Disponible en día {bird.unlockDays}
                </p>
                <p className="text-xs text-nido-dusk/30 mt-0.5 italic">{bird.name}</p>
                <div className="mt-1.5">
                  <span className="pill-muted">
                    🔒 {bird.unlockDays} días
                  </span>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-nido-dusk leading-tight">
                  {bird.name}
                </p>
                {bird.species && (
                  <p className="text-xs text-nido-dusk/45 italic mt-0.5 leading-tight">
                    {bird.species}
                  </p>
                )}
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <Badge variant={bird.rarity}>{RARITY_LABELS[bird.rarity]}</Badge>
                  <Badge variant={bird.status as any}>{statusLabel(bird.status)}</Badge>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Hunger bar */}
        {!isLocked && bird.status !== 'away' && (
          <div className="mt-3.5 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-nido-dusk/40 font-medium">Energía</span>
              <span className="text-[10px] font-semibold text-nido-dusk/55">{bird.hungerLevel}%</span>
            </div>
            <div className="relative h-1.5 rounded-full bg-nido-dusk/8 overflow-hidden">
              <div
                className={cn(
                  'absolute inset-y-0 left-0 rounded-full transition-all duration-500',
                  hungerColor(bird.hungerLevel),
                )}
                style={{ width: `${bird.hungerLevel}%` }}
              />
            </div>
          </div>
        )}

        {/* Feed button */}
        {!isLocked && canFeed && bird.status !== 'away' && (
          <Button
            variant="outline"
            size="sm"
            className="mt-3 w-full text-xs rounded-2xl border-nido-sage/25 hover:border-nido-sage/50 hover:bg-nido-sage/5"
            onClick={(e) => {
              e.stopPropagation()
              onFeed?.(bird.id)
            }}
          >
            <span className="text-sm">🌱</span>
            Alimentar · {bird.feedCost} semillas
          </Button>
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

// ─── Status dot ───────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: Bird['status'] }) {
  return (
    <span
      className={cn(
        'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white',
        {
          'bg-emerald-400': status === 'healthy',
          'bg-red-400':     status === 'sick',
          'bg-nido-dusk/30':status === 'away',
          'bg-amber-400':   status === 'recovering',
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
