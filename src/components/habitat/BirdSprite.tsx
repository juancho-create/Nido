'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import type { Bird } from '@/lib/types'

interface BirdSpriteProps {
  bird: Bird
  onFeed?: (id: string) => void
  canFeed?: boolean
}

const RARITY_GLOW: Record<string, string> = {
  common:    '',
  uncommon:  'drop-shadow(0 0 6px rgba(99,102,241,0.5))',
  rare:      'drop-shadow(0 0 8px rgba(168,85,247,0.6))',
  legendary: 'drop-shadow(0 0 12px rgba(245,158,11,0.8))',
}

const STATUS_EFFECTS: Record<string, string> = {
  healthy:    '',
  sick:       'grayscale(60%) brightness(0.85)',
  away:       'opacity: 0.3',
  recovering: 'brightness(1.1)',
  locked:     '',
}

export function BirdSprite({ bird, onFeed, canFeed }: BirdSpriteProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  if (bird.status === 'locked') return null

  const animClass =
    bird.status === 'away'      ? 'opacity-30' :
    bird.status === 'sick'      ? 'animate-pulse-soft grayscale' :
    bird.rarity === 'legendary' ? 'animate-float-slow' :
    bird.rarity === 'rare'      ? 'animate-float' :
                                   'animate-float-fast'

  return (
    <div
      className="absolute cursor-pointer select-none"
      style={{
        left: `${bird.habitatPosition.x}%`,
        top:  `${bird.habitatPosition.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onTouchStart={() => setShowTooltip(true)}
      onTouchEnd={() => setTimeout(() => setShowTooltip(false), 1500)}
      onClick={() => canFeed && onFeed?.(bird.id)}
    >
      {/* Bird sprite */}
      <div
        className={cn('relative flex flex-col items-center', animClass)}
        style={{ filter: RARITY_GLOW[bird.rarity] }}
      >
        {/* Rarity aura for rare+ */}
        {(bird.rarity === 'rare' || bird.rarity === 'legendary') && (
          <div
            className="absolute inset-0 rounded-full blur-md opacity-40 -z-10 scale-150"
            style={{ background: bird.color }}
          />
        )}

        <span
          className={cn('text-3xl leading-none', {
            'grayscale': bird.status === 'sick',
            'opacity-40': bird.status === 'away',
          })}
          role="img"
          aria-label={bird.name}
        >
          {bird.emoji}
        </span>

        {/* Status dot */}
        <div
          className={cn('mt-1 w-2 h-2 rounded-full border-2 border-white', {
            'bg-green-400':  bird.status === 'healthy',
            'bg-red-400':    bird.status === 'sick',
            'bg-gray-300':   bird.status === 'away',
            'bg-yellow-400': bird.status === 'recovering',
          })}
        />
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none animate-fade-in">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-glass px-3 py-2 text-center whitespace-nowrap border border-white/80">
            <p className="text-xs font-semibold text-nido-dusk">{bird.name}</p>
            {canFeed && bird.status !== 'away' && (
              <p className="text-[10px] text-nido-sage mt-0.5">
                Toca para alimentar ({bird.feedCost} 🌱)
              </p>
            )}
            {bird.status === 'sick' && (
              <p className="text-[10px] text-red-500 mt-0.5">Necesita cuidado</p>
            )}
            {bird.status === 'away' && (
              <p className="text-[10px] text-gray-400 mt-0.5">Voló lejos…</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
