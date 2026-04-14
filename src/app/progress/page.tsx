'use client'

import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { StatCard } from '@/components/progress/StatCard'
import { AchievementBadge } from '@/components/progress/AchievementBadge'
import { useNidoStore } from '@/lib/store/useNidoStore'
import { moneySaved, cigarettesNotSmoked } from '@/lib/utils/rewards'
import { formatDate } from '@/lib/utils/dates'
import { cn } from '@/lib/utils/cn'

export default function ProgressPage() {
  const router = useRouter()
  const { user, streak, achievements, journal, isOnboarded } = useNidoStore()

  if (!isOnboarded) {
    if (typeof window !== 'undefined') router.replace('/onboarding')
    return null
  }

  const saved = user
    ? moneySaved(streak.totalSmokeFree, user.cigarettesPerDay, user.pricePerPack, user.cigarettesPerPack)
    : 0

  const notSmoked       = user ? cigarettesNotSmoked(streak.totalSmokeFree, user.cigarettesPerDay) : 0
  const unlockedCount   = achievements.filter((a) => a.unlocked).length
  const smokeFreeEntries = journal.filter((e) => e.type === 'smoke_free')
  const cravingsResisted = journal.filter((e) => e.type === 'craving_resisted').length

  return (
    <AppShell>
      <div className="pt-12 pb-6 px-4 space-y-6 animate-fade-in">

        {/* ── Header ────────────────────────────────────────── */}
        <div>
          <h1 className="text-2xl font-bold text-nido-dusk tracking-tight">Progreso</h1>
          {user?.quitDate && (
            <p className="text-xs text-nido-dusk/40 mt-0.5">
              Desde el {formatDate(user.quitDate)}
            </p>
          )}
        </div>

        {/* ── Streak spotlight ──────────────────────────────── */}
        <StreakSpotlight currentStreak={streak.currentStreak} longestStreak={streak.longestStreak} />

        {/* ── Key stats grid ────────────────────────────────── */}
        <section className="space-y-3">
          <p className="section-label">Resumen</p>
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon="📅"
              label="Total sin fumar"
              value={streak.totalSmokeFree}
              sub={streak.totalSmokeFree === 1 ? 'día histórico' : 'días históricos'}
              accent="sage"
              className="animate-slide-up delay-75"
            />
            <StatCard
              icon="🚭"
              label="No fumados"
              value={notSmoked}
              sub="cigarrillos"
              accent="sage"
              className="animate-slide-up delay-100"
            />
            <StatCard
              icon="⚡"
              label="Antojos resistidos"
              value={cravingsResisted}
              sub="momentos de fuerza"
              accent="amber"
              className="animate-slide-up delay-150"
            />
            <StatCard
              icon="🏆"
              label="Logros"
              value={`${unlockedCount}/${achievements.length}`}
              sub="desbloqueados"
              accent="gold"
              className="animate-slide-up delay-200"
            />
          </div>
        </section>

        {/* ── Money saved ───────────────────────────────────── */}
        <MoneySavedCard saved={saved} cigarettesPerDay={user?.cigarettesPerDay ?? 0} />

        {/* ── Daily calendar ────────────────────────────────── */}
        {smokeFreeEntries.length > 0 && (
          <DailyCalendar entries={smokeFreeEntries} />
        )}

        {/* ── Achievements ──────────────────────────────────── */}
        <section className="space-y-3">
          <p className="section-label">Logros</p>
          <div className="space-y-2">
            {achievements.map((ach, i) => (
              <div
                key={ach.id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <AchievementBadge achievement={ach} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  )
}

// ─── Streak spotlight ─────────────────────────────────────────────────────────

function StreakSpotlight({
  currentStreak, longestStreak,
}: {
  currentStreak: number
  longestStreak: number
}) {
  const pct = longestStreak > 0 ? Math.min(100, (currentStreak / longestStreak) * 100) : 0
  const circumference = 2 * Math.PI * 36  // r=36

  return (
    <div className="rounded-3xl bg-white/72 border border-nido-sage/15 shadow-card backdrop-blur-sm p-5">
      <div className="flex items-center gap-5">

        {/* Ring */}
        <div className="relative flex-shrink-0 w-[88px] h-[88px]">
          <svg width="88" height="88" className="-rotate-90">
            <circle cx="44" cy="44" r="36" className="progress-ring-track" strokeWidth="6" />
            <circle
              cx="44" cy="44" r="36"
              className="progress-ring-fill"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - pct / 100)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-nido-forest leading-none">{currentStreak}</span>
            <span className="text-[9px] text-nido-dusk/40 uppercase tracking-wide mt-0.5">días</span>
          </div>
        </div>

        {/* Text */}
        <div className="flex-1">
          <p className="text-xs text-nido-dusk/40 font-semibold uppercase tracking-wide mb-1">
            Racha actual
          </p>
          <p className="text-2xl font-bold text-nido-dusk leading-none">
            {currentStreak} <span className="text-base font-medium text-nido-dusk/50">días</span>
          </p>

          {longestStreak > 0 && (
            <div className="mt-2 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-nido-dusk/35">Mejor racha</span>
                <span className="text-[10px] font-semibold text-nido-dusk/55">{longestStreak} días</span>
              </div>
              <div className="h-1 rounded-full bg-nido-dusk/8 overflow-hidden">
                <div
                  className="h-full rounded-full bg-nido-sage/60 transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}

          {currentStreak > 0 && (
            <p className="text-xs text-nido-forest font-medium mt-2">
              {currentStreak >= longestStreak
                ? '⭐ ¡Tu mejor racha hasta ahora!'
                : `${longestStreak - currentStreak} días para tu récord`}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Money saved ──────────────────────────────────────────────────────────────

function MoneySavedCard({ saved, cigarettesPerDay }: { saved: number; cigarettesPerDay: number }) {
  return (
    <div className="rounded-3xl border border-nido-gold/25 shadow-card overflow-hidden"
      style={{ background: 'linear-gradient(135deg, rgba(244,196,48,0.14) 0%, rgba(232,145,90,0.08) 100%)' }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-nido-gold/20 flex items-center justify-center text-lg">
                💰
              </div>
              <p className="text-[10px] font-semibold text-yellow-700 uppercase tracking-[0.1em]">
                Dinero ahorrado
              </p>
            </div>
            <p className="text-4xl font-bold tracking-tight"
              style={{
                backgroundImage: 'linear-gradient(135deg, #B8860B 0%, #D4A017 50%, #F4C430 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ${saved.toFixed(2)}
            </p>
            {cigarettesPerDay > 0 && (
              <p className="text-xs text-yellow-700/60 mt-1.5">
                {cigarettesPerDay} cigarrillos/día · cada día sin fumar suma
              </p>
            )}
          </div>

          {/* Visual accent */}
          <div className="text-4xl opacity-20 mt-1">✦</div>
        </div>
      </div>
    </div>
  )
}

// ─── Daily calendar ───────────────────────────────────────────────────────────

function DailyCalendar({ entries }: { entries: Array<{ id: string; date: string }> }) {
  const last30 = entries.slice(-30).reverse()
  const dateSet = new Set(last30.map((e) => e.date))

  // Build a 5-week display (today backwards)
  const today = new Date()
  const days: Date[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push(d)
  }

  return (
    <section className="space-y-3">
      <p className="section-label">Últimos 30 días</p>

      <div className="rounded-3xl bg-white/65 border border-white/70 shadow-glass backdrop-blur-sm p-4">
        {/* Weekday labels */}
        <div className="grid grid-cols-7 mb-2">
          {['L','M','X','J','V','S','D'].map((d) => (
            <p key={d} className="text-center text-[9px] text-nido-dusk/30 font-semibold uppercase tracking-wide">
              {d}
            </p>
          ))}
        </div>

        {/* Day cells — 5 rows of 7 (first row may be padded) */}
        <CalendarGrid days={days} dateSet={dateSet} />

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 justify-center">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-nido-sage/80 inline-block" />
            <span className="text-[10px] text-nido-dusk/45">Día limpio</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-nido-dusk/10 inline-block" />
            <span className="text-[10px] text-nido-dusk/45">Sin registro</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function CalendarGrid({ days, dateSet }: { days: Date[]; dateSet: Set<string> }) {
  // Pad so the first day aligns to its weekday (Mon=0)
  const firstDow = (days[0].getDay() + 6) % 7 // Mon-based
  const cells: Array<Date | null> = [
    ...Array(firstDow).fill(null),
    ...days,
  ]
  // Pad tail to complete last row
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="grid grid-cols-7 gap-1">
      {cells.map((day, i) => {
        if (!day) return <div key={`pad-${i}`} />

        const iso = day.toISOString().split('T')[0]
        const isSmokeFree = dateSet.has(iso)
        const isToday = iso === new Date().toISOString().split('T')[0]

        return (
          <div
            key={iso}
            title={iso}
            className={cn(
              'aspect-square rounded-xl flex items-center justify-center text-[10px] font-semibold',
              'transition-all duration-200',
              isSmokeFree
                ? 'bg-nido-sage/80 text-white shadow-sage-glow'
                : 'bg-nido-dusk/6 text-nido-dusk/35',
              isToday && !isSmokeFree && 'ring-1 ring-nido-dusk/20',
              isToday && isSmokeFree && 'ring-1 ring-nido-forest/40',
            )}
          >
            {day.getDate()}
          </div>
        )
      })}
    </div>
  )
}
