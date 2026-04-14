'use client'

import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/shared/GlassCard'
import type { StreakData, Resources } from '@/lib/types'

interface ActionPanelProps {
  streak: StreakData
  resources: Resources
  onCheckIn: () => void
  onRelapse: () => void
  onCraving: () => void
}

export function ActionPanel({
  streak, resources, onCheckIn, onRelapse, onCraving,
}: ActionPanelProps) {
  const { todayCheckedIn } = streak

  return (
    <GlassCard intensity="heavy" padding="md" className="mx-4">
      {/* Main CTA */}
      {todayCheckedIn ? (
        <div className="flex items-center justify-center gap-3 py-2">
          <div className="w-8 h-8 rounded-full bg-nido-sage/20 flex items-center justify-center">
            <span className="text-lg">✓</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-nido-forest">Día registrado</p>
            <p className="text-xs text-nido-dusk/50">Vuelve mañana para tu siguiente recompensa</p>
          </div>
        </div>
      ) : (
        <Button
          size="xl"
          className="w-full bg-nido-sage hover:bg-nido-forest shadow-float"
          onClick={onCheckIn}
        >
          <span className="text-xl">🌿</span>
          Registrar día limpio
        </Button>
      )}

      {/* Secondary actions */}
      <div className="flex gap-2 mt-3">
        <Button
          variant="glass"
          size="sm"
          className="flex-1 text-xs"
          onClick={onCraving}
        >
          <span>⚡</span>
          Tuve un antojo
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 text-xs text-nido-dusk/50"
          onClick={onRelapse}
          disabled={todayCheckedIn}
        >
          <span>🍃</span>
          Tuve recaída
        </Button>
      </div>

      {/* Seeds hint */}
      <p className="text-[10px] text-center text-nido-dusk/35 mt-3">
        Toca las aves para alimentarlas con tus {resources.seeds} 🌱 semillas
      </p>
    </GlassCard>
  )
}
