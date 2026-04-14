'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import type { StreakData, Resources } from '@/lib/types'

interface ActionPanelProps {
  streak:      StreakData
  resources:   Resources
  onCheckIn:   () => void
  onRelapse:   () => void
  onCraving:   () => void
}

export function ActionPanel({ streak, resources, onCheckIn, onRelapse, onCraving }: ActionPanelProps) {
  const { todayCheckedIn } = streak

  return (
    <div className="rounded-3xl bg-white/80 border border-white/80 shadow-glass-md backdrop-blur-md p-4 space-y-3">

      {/* ── Main CTA ───────────────────────────────────────────── */}
      {todayCheckedIn ? (
        <CheckedInState />
      ) : (
        <Button
          size="xl"
          className="w-full rounded-2xl bg-nido-sage hover:bg-nido-forest shadow-sage-glow text-white gap-2.5"
          onClick={onCheckIn}
        >
          <span className="text-xl">🌿</span>
          Registrar día limpio
        </Button>
      )}

      {/* ── Secondary actions ──────────────────────────────────── */}
      <div className="flex gap-2.5">
        <button
          onClick={onCraving}
          className={cn(
            'flex-1 flex flex-col items-center gap-1 rounded-2xl py-2.5',
            'bg-nido-amber/8 border border-nido-amber/18',
            'text-nido-rose text-xs font-semibold',
            'transition-all duration-150 active:scale-95 hover:bg-nido-amber/12',
          )}
        >
          <span className="text-base">⚡</span>
          <span>Tuve un antojo</span>
        </button>

        <button
          onClick={onRelapse}
          disabled={todayCheckedIn}
          className={cn(
            'flex-1 flex flex-col items-center gap-1 rounded-2xl py-2.5',
            'bg-nido-dusk/4 border border-nido-dusk/8',
            'text-nido-dusk/45 text-xs font-medium',
            'transition-all duration-150 active:scale-95 hover:bg-nido-dusk/7',
            'disabled:opacity-35 disabled:pointer-events-none',
          )}
        >
          <span className="text-base">🍃</span>
          <span>Tuve una recaída</span>
        </button>
      </div>

      {/* ── Seeds hint ─────────────────────────────────────────── */}
      {resources.seeds > 0 && (
        <p className="text-[10px] text-center text-nido-dusk/30 font-medium">
          Toca las aves para alimentarlas · {resources.seeds} 🌱 semillas disponibles
        </p>
      )}
    </div>
  )
}

function CheckedInState() {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-nido-sage/8 border border-nido-sage/15 px-4 py-3.5">
      <div className="w-9 h-9 rounded-xl bg-nido-sage/18 flex items-center justify-center flex-shrink-0">
        <span className="text-lg">✓</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-nido-forest">Día registrado</p>
        <p className="text-xs text-nido-dusk/45 mt-0.5">
          Vuelve mañana para tu siguiente recompensa
        </p>
      </div>
    </div>
  )
}
