'use client'

import { BirdSprite } from './BirdSprite'
import type { Bird, Biome } from '@/lib/types'

interface HabitatSceneProps {
  biome: Biome
  birds: Bird[]
  onFeedBird: (id: string) => void
  canFeed: boolean
}

export function HabitatScene({ biome, birds, onFeedBird, canFeed }: HabitatSceneProps) {
  const [sky1, sky2] = biome.skyGradient

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: '52vw',
        maxHeight: '260px',
        minHeight: '180px',
        background: `linear-gradient(180deg, ${sky1} 0%, ${sky2} 100%)`,
      }}
    >
      {/* Clouds */}
      <Cloud x={12} y={12} size={60} opacity={0.75} delay={0} />
      <Cloud x={65} y={8}  size={80} opacity={0.65} delay={2} />
      <Cloud x={40} y={18} size={45} opacity={0.55} delay={1} />

      {/* Back mountains */}
      <svg
        className="absolute bottom-[28%] left-0 w-full"
        viewBox="0 0 430 80"
        preserveAspectRatio="none"
      >
        <path
          d="M0 80 L60 30 L130 60 L200 15 L280 50 L350 20 L430 45 L430 80 Z"
          fill={`${biome.accentColor}66`}
        />
      </svg>

      {/* Mid hills */}
      <svg
        className="absolute bottom-[14%] left-0 w-full"
        viewBox="0 0 430 60"
        preserveAspectRatio="none"
      >
        <path
          d="M0 60 L0 35 Q80 5 160 28 Q240 50 320 20 Q380 0 430 25 L430 60 Z"
          fill={`${biome.groundColor}99`}
        />
      </svg>

      {/* Trees */}
      <TreeGroup x={5}   treeColor={biome.treeColor} scale={0.9} />
      <TreeGroup x={78}  treeColor={biome.treeColor} scale={1.1} />
      <TreeGroup x={42}  treeColor={biome.treeColor} scale={0.7} />

      {/* Ground */}
      <div
        className="absolute bottom-0 left-0 right-0 rounded-t-[40%]"
        style={{
          height: '16%',
          background: biome.groundColor,
        }}
      />

      {/* Birds */}
      {birds.map((bird) => (
        <BirdSprite
          key={bird.id}
          bird={bird}
          onFeed={onFeedBird}
          canFeed={canFeed}
        />
      ))}
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Cloud({
  x, y, size, opacity, delay,
}: {
  x: number; y: number; size: number; opacity: number; delay: number
}) {
  return (
    <div
      className="absolute animate-float"
      style={{
        left: `${x}%`,
        top:  `${y}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${6 + delay}s`,
      }}
    >
      <svg
        width={size}
        height={size * 0.5}
        viewBox="0 0 100 50"
        style={{ opacity }}
      >
        <circle cx="30" cy="35" r="20" fill="white" />
        <circle cx="55" cy="28" r="26" fill="white" />
        <circle cx="78" cy="35" r="18" fill="white" />
        <rect x="12" y="35" width="86" height="15" fill="white" />
      </svg>
    </div>
  )
}

function TreeGroup({
  x, treeColor, scale = 1,
}: {
  x: number; treeColor: string; scale?: number
}) {
  return (
    <div
      className="absolute bottom-[13%]"
      style={{ left: `${x}%`, transform: `scale(${scale})`, transformOrigin: 'bottom center' }}
    >
      <svg width="32" height="52" viewBox="0 0 32 52">
        {/* trunk */}
        <rect x="13" y="38" width="6" height="14" rx="2" fill={`${treeColor}99`} />
        {/* canopy layers */}
        <polygon points="16,2 30,24 2,24"  fill={treeColor} />
        <polygon points="16,14 28,34 4,34" fill={treeColor} opacity="0.9" />
        <polygon points="16,24 26,40 6,40" fill={treeColor} opacity="0.8" />
      </svg>
    </div>
  )
}
