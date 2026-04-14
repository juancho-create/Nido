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
  const [checkInResult, setCheckInResult] = useState<CheckInResult | null>(null)
  const [relapseResult, setRelapseResult] = useState<RelapseResult | null>(null)

  if (!isOnboarded) {
    if (typeof window !== 'undefined') router.replace('/onboarding')
    return null
  }

  const biome       = getCurrentBiome()
  const activeBirds = getActiveBirds()
  const canFeed     = resources.seeds > 0

  function handleCheckIn(note?: string)  { setCheckInResult(checkInToday(note)); }
  function handleRelapse(note?: string)  { setRelapseResult(registerRelapse(note)); }
  function handleResistCraving()         { resistCraving(); setModal(null); }
  function handleCravingRelapse()        { setModal('relapse'); }
  function handleFeedBird(birdId: string){ feedBird(birdId); }

  return (
    <AppShell>
      <div className="flex flex-col min-h-full animate-fade-in">

        {/* ── Header ──────────────────────────────────────────── */}
        <div className="pt-12 pb-2 px-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-semibold text-nido-dusk/35 uppercase tracking-[0.12em] mb-0.5">
                {biome.name}
              </p>
              <h1 className="text-xl font-bold text-nido-dusk leading-none">
                {user?.name ? `Hola, ${user.name}` : 'Tu Nido'}
              </h1>
            </div>

            {/* Active birds pill */}
            {activeBirds.length > 0 && (
              <div className="flex items-center gap-1.5 rounded-full bg-white/70 border border-white/80 shadow-glass px-3 py-1.5 backdrop-blur-sm">
                <span className="text-sm">🐦</span>
                <span className="text-xs font-semibold text-nido-dusk/60">
                  {activeBirds.length}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Habitat scene ────────────────────────────────────── */}
        <HabitatScene
          biome={biome}
          birds={activeBirds}
          onFeedBird={handleFeedBird}
          canFeed={canFeed}
        />

        {/* ── Resource bar ─────────────────────────────────────── */}
        <ResourceBar resources={resources} streak={streak.currentStreak} />

        {/* ── Motivation banner ────────────────────────────────── */}
        {user?.motivation && (
          <div className="mx-4 mt-3">
            <div className="rounded-2xl bg-nido-sage/7 border border-nido-sage/12 px-4 py-3 flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-nido-sage/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs">💚</span>
              </div>
              <p className="text-xs text-nido-forest leading-relaxed">
                <span className="font-semibold">Tu razón: </span>
                {user.motivation}
              </p>
            </div>
          </div>
        )}

        {/* ── Actions ──────────────────────────────────────────── */}
        <div className="mt-3 px-4">
          <ActionPanel
            streak={streak}
            resources={resources}
            onCheckIn={() => setModal('checkIn')}
            onRelapse={() => setModal('relapse')}
            onCraving={() => setModal('craving')}
          />
        </div>

        {/* ── Next bird hint ───────────────────────────────────── */}
        <NextBirdHint streak={streak.currentStreak} birds={birds} />
      </div>

      {/* ── Modals ───────────────────────────────────────────── */}
      <CheckInModal
        open={modal === 'checkIn'}
        onClose={() => { setModal(null); setCheckInResult(null); }}
        onConfirm={handleCheckIn}
        result={checkInResult}
      />
      <RelapseModal
        open={modal === 'relapse'}
        onClose={() => { setModal(null); setRelapseResult(null); }}
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

function NextBirdHint({ streak, birds }: { streak: number; birds: Bird[] }) {
  const next = birds
    .filter((b) => b.status === 'locked')
    .sort((a, b) => a.unlockDays - b.unlockDays)[0]

  if (!next) return null

  const daysLeft = Math.max(0, next.unlockDays - streak)
  const pct      = Math.min(100, (streak / next.unlockDays) * 100)

  return (
    <div className="mx-4 mt-3 mb-4">
      <div className="rounded-2xl bg-white/55 border border-white/65 shadow-glass backdrop-blur-sm px-4 py-3.5">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-[10px] text-nido-dusk/40 font-semibold uppercase tracking-wide">
              Próxima ave
            </p>
            <p className="text-sm font-semibold text-nido-dusk mt-0.5">{next.name}</p>
          </div>
          <div className="text-right flex flex-col items-end gap-0.5">
            <span className="text-2xl opacity-35">{next.emoji}</span>
            <p className="text-[10px] text-nido-dusk/40 font-medium">
              {daysLeft === 0 ? '¡Hoy!' : `en ${daysLeft} día${daysLeft !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {/* Progress towards unlock */}
        <div className="h-1 rounded-full bg-nido-dusk/8 overflow-hidden">
          <div
            className="h-full rounded-full bg-nido-sage/50 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}
