'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { HabitatScene } from '@/components/habitat/HabitatScene'
import { ResourceBar } from '@/components/habitat/ResourceBar'
import { ActionPanel } from '@/components/habitat/ActionPanel'
import { CheckInModal } from '@/components/habitat/CheckInModal'
import { RelapseModal } from '@/components/habitat/RelapseModal'
import { CravingModal } from '@/components/habitat/CravingModal'
import { useNidoStore } from '@/lib/store/useNidoStore'
import type { CheckInResult, RelapseResult, Bird } from '@/lib/types'

export default function HabitatPage() {
  const router = useRouter()
  const {
    user, isOnboarded, streak, resources, birds,
    currentBiomeId, getCurrentBiome, getActiveBirds,
    checkInToday, registerRelapse, resistCraving, feedBird,
  } = useNidoStore()

  const [modal, setModal] = useState<'checkIn' | 'relapse' | 'craving' | null>(null)
  const [checkInResult, setCheckInResult]   = useState<CheckInResult | null>(null)
  const [relapseResult, setRelapseResult]   = useState<RelapseResult | null>(null)

  // Guard: redirect to onboarding if needed
  if (!isOnboarded) {
    if (typeof window !== 'undefined') router.replace('/onboarding')
    return null
  }

  const biome       = getCurrentBiome()
  const activeBirds = getActiveBirds()
  const canFeed     = resources.seeds > 0

  function handleCheckIn(note?: string) {
    const result = checkInToday(note)
    setCheckInResult(result)
  }

  function handleRelapse(note?: string) {
    const result = registerRelapse(note)
    setRelapseResult(result)
  }

  function handleResistCraving() {
    resistCraving()
    setModal(null)
  }

  function handleCravingRelapse() {
    setModal('relapse')
  }

  function handleFeedBird(birdId: string) {
    const ok = feedBird(birdId)
    // TODO: show feedback toast
  }

  return (
    <AppShell>
      <div className="flex flex-col min-h-full">
        {/* Biome header */}
        <div className="pt-10 pb-1 px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-semibold text-nido-dusk/70">
                {user?.name ? `Hola, ${user.name}` : 'Tu Nido'}
              </h1>
              <p className="text-xs text-nido-dusk/40">{biome.name}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-nido-dusk/40">{activeBirds.length} ave{activeBirds.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        {/* Habitat scene */}
        <div className="relative">
          <HabitatScene
            biome={biome}
            birds={activeBirds}
            onFeedBird={handleFeedBird}
            canFeed={canFeed}
          />
        </div>

        {/* Stats bar */}
        <ResourceBar resources={resources} streak={streak.currentStreak} />

        {/* Motivation banner */}
        {user?.motivation && (
          <div className="mx-4 mt-3">
            <div className="rounded-2xl bg-nido-sage/8 border border-nido-sage/15 px-4 py-2.5 flex items-start gap-2">
              <span className="text-sm">💚</span>
              <p className="text-xs text-nido-forest leading-relaxed">
                <strong>Tu razón: </strong>{user.motivation}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-3">
          <ActionPanel
            streak={streak}
            resources={resources}
            onCheckIn={() => setModal('checkIn')}
            onRelapse={() => setModal('relapse')}
            onCraving={() => setModal('craving')}
          />
        </div>

        {/* Next bird hint */}
        <NextBirdHint streak={streak.currentStreak} birds={birds} />
      </div>

      {/* Modals */}
      <CheckInModal
        open={modal === 'checkIn'}
        onClose={() => { setModal(null); setCheckInResult(null) }}
        onConfirm={handleCheckIn}
        result={checkInResult}
      />

      <RelapseModal
        open={modal === 'relapse'}
        onClose={() => { setModal(null); setRelapseResult(null) }}
        onConfirm={handleRelapse}
        result={relapseResult}
      />

      <CravingModal
        open={modal === 'craving'}
        onClose={() => setModal(null)}
        onResisted={handleResistCraving}
        onRelapse={handleCravingRelapse}
      />
    </AppShell>
  )
}

// ─── Next bird hint ───────────────────────────────────────────────────────────

function NextBirdHint({
  streak, birds,
}: {
  streak: number
  birds: Bird[]
}) {
  const next = birds
    .filter((b) => b.status === 'locked')
    .sort((a, b) => a.unlockDays - b.unlockDays)[0]

  if (!next) return null

  const daysLeft = Math.max(0, next.unlockDays - streak)

  return (
    <div className="mx-4 mt-3 mb-2">
      <div className="rounded-2xl border border-white/60 bg-white/40 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-nido-dusk/50">Próxima ave</p>
          <p className="text-sm font-semibold text-nido-dusk">{next.name}</p>
        </div>
        <div className="text-right">
          <span className="text-2xl opacity-40">{next.emoji}</span>
          <p className="text-xs text-nido-dusk/40 mt-0.5">
            {daysLeft === 0 ? '¡Hoy!' : `en ${daysLeft} día${daysLeft !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>
    </div>
  )
}
