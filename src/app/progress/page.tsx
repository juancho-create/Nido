'use client'

import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { StatCard } from '@/components/progress/StatCard'
import { AchievementBadge } from '@/components/progress/AchievementBadge'
import { useNidoStore } from '@/lib/store/useNidoStore'
import { moneySaved, cigarettesNotSmoked } from '@/lib/utils/rewards'
import { formatDate } from '@/lib/utils/dates'

export default function ProgressPage() {
  const router = useRouter()
  const { user, streak, achievements, journal, isOnboarded } = useNidoStore()

  if (!isOnboarded) {
    if (typeof window !== 'undefined') router.replace('/onboarding')
    return null
  }

  const saved = user
    ? moneySaved(
        streak.totalSmokeFree,
        user.cigarettesPerDay,
        user.pricePerPack,
        user.cigarettesPerPack,
      )
    : 0

  const notSmoked = user
    ? cigarettesNotSmoked(streak.totalSmokeFree, user.cigarettesPerDay)
    : 0

  const unlockedCount  = achievements.filter((a) => a.unlocked).length
  const smokeFreeEntries = journal.filter((e) => e.type === 'smoke_free')
  const cravingsResisted = journal.filter((e) => e.type === 'craving_resisted').length

  return (
    <AppShell>
      <div className="pt-10 pb-4 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-nido-dusk">Progreso</h1>
          {user?.quitDate && (
            <p className="text-xs text-nido-dusk/40 mt-0.5">
              Desde el {formatDate(user.quitDate)}
            </p>
          )}
        </div>

        {/* Main stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard
            icon="🔥"
            label="Racha actual"
            value={streak.currentStreak}
            sub={streak.currentStreak === 1 ? 'día' : 'días'}
            accent="amber"
          />
          <StatCard
            icon="⭐"
            label="Mejor racha"
            value={streak.longestStreak}
            sub={`de ${streak.longestStreak} ${streak.longestStreak === 1 ? 'día' : 'días'}`}
            accent="gold"
          />
          <StatCard
            icon="📅"
            label="Total sin fumar"
            value={streak.totalSmokeFree}
            sub={streak.totalSmokeFree === 1 ? 'día histórico' : 'días históricos'}
            accent="sage"
          />
          <StatCard
            icon="🚭"
            label="No fumados"
            value={notSmoked}
            sub="cigarrillos"
            accent="sage"
          />
        </div>

        {/* Money saved */}
        <div className="mb-6 rounded-3xl bg-gradient-to-br from-nido-gold/20 to-nido-amber/10 border border-nido-gold/20 p-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">💰</span>
            <p className="text-xs text-yellow-700 uppercase tracking-wide font-semibold">Dinero ahorrado</p>
          </div>
          <p className="text-4xl font-bold text-yellow-700">${saved.toFixed(2)}</p>
          <p className="text-xs text-yellow-600/70 mt-1">
            A razón de {user?.cigarettesPerDay} cigarrillos/día
          </p>
        </div>

        {/* More stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard
            icon="⚡"
            label="Antojos resistidos"
            value={cravingsResisted}
            sub="momentos de fuerza"
            accent="blue"
          />
          <StatCard
            icon="🏆"
            label="Logros"
            value={`${unlockedCount}/${achievements.length}`}
            sub="desbloqueados"
            accent="gold"
          />
        </div>

        {/* Journal mini-calendar */}
        {smokeFreeEntries.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-semibold text-nido-dusk/50 uppercase tracking-wide mb-3">
              Últimos días registrados
            </h2>
            <div className="flex flex-wrap gap-2">
              {smokeFreeEntries
                .slice(-30)
                .reverse()
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="w-9 h-9 rounded-xl bg-nido-sage/20 border border-nido-sage/25 flex items-center justify-center text-xs font-semibold text-nido-forest"
                    title={entry.date}
                  >
                    {new Date(entry.date).getDate()}
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        <section>
          <h2 className="text-xs font-semibold text-nido-dusk/50 uppercase tracking-wide mb-3">
            Logros
          </h2>
          <div className="space-y-2">
            {achievements.map((ach) => (
              <AchievementBadge key={ach.id} achievement={ach} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  )
}
