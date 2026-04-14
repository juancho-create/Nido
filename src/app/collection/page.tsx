'use client'

import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { BirdCard } from '@/components/collection/BirdCard'
import { useNidoStore } from '@/lib/store/useNidoStore'

export default function CollectionPage() {
  const router      = useRouter()
  const { birds, resources, streak, feedBird, isOnboarded } = useNidoStore()

  if (!isOnboarded) {
    if (typeof window !== 'undefined') router.replace('/onboarding')
    return null
  }

  const canFeed    = resources.seeds > 0
  const unlocked   = birds.filter((b) => b.status !== 'locked')
  const locked     = birds.filter((b) => b.status === 'locked')

  function handleFeed(birdId: string) {
    feedBird(birdId)
  }

  return (
    <AppShell>
      <div className="pt-10 pb-4 px-4">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-nido-dusk">Colección</h1>
          <p className="text-sm text-nido-dusk/50 mt-0.5">
            {unlocked.length} / {birds.length} aves desbloqueadas
          </p>
        </div>

        {/* Seeds counter */}
        <div className="flex items-center gap-2 mb-5 rounded-2xl bg-nido-sage/10 border border-nido-sage/15 px-4 py-2.5">
          <span className="text-lg">🌱</span>
          <span className="text-sm font-semibold text-nido-forest">
            {resources.seeds} semillas disponibles
          </span>
          {resources.seeds === 0 && (
            <span className="text-xs text-nido-dusk/40 ml-auto">
              Registra días para conseguir más
            </span>
          )}
        </div>

        {/* Unlocked birds */}
        {unlocked.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-semibold text-nido-dusk/50 uppercase tracking-wide mb-3">
              En tu nido
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {unlocked.map((bird) => (
                <BirdCard
                  key={bird.id}
                  bird={bird}
                  onFeed={handleFeed}
                  canFeed={canFeed}
                />
              ))}
            </div>
          </section>
        )}

        {/* Locked birds */}
        {locked.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-nido-dusk/50 uppercase tracking-wide mb-3">
              Por descubrir
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {locked.map((bird) => (
                <BirdCard key={bird.id} bird={bird} />
              ))}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  )
}
