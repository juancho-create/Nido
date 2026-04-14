import { GlassCard } from '@/components/shared/GlassCard'
import { cn } from '@/lib/utils/cn'

interface StatCardProps {
  icon:      string
  label:     string
  value:     string | number
  sub?:      string
  accent?:   'sage' | 'amber' | 'gold' | 'blue'
  className?: string
}

// Background gradient per accent
const ACCENT_BG: Record<string, string> = {
  sage:  'bg-stat-sage  border-nido-sage/18',
  amber: 'bg-stat-amber border-nido-amber/18',
  gold:  'bg-stat-gold  border-nido-gold/22',
  blue:  'bg-stat-blue  border-nido-sky/30',
}

// Value colour
const ACCENT_VALUE: Record<string, string> = {
  sage:  'text-gradient-sage',
  amber: 'text-nido-amber',
  gold:  'text-gradient-gold',
  blue:  'text-nido-sky',
}

// Icon bubble tint
const ACCENT_ICON_BG: Record<string, string> = {
  sage:  'bg-nido-sage/12',
  amber: 'bg-nido-amber/12',
  gold:  'bg-nido-gold/18',
  blue:  'bg-nido-sky/20',
}

export function StatCard({
  icon, label, value, sub, accent = 'sage', className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border backdrop-blur-sm p-5 flex flex-col gap-2',
        'shadow-card transition-all duration-200',
        ACCENT_BG[accent],
        className,
      )}
    >
      {/* Icon + label row */}
      <div className="flex items-center gap-2">
        <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center text-lg flex-shrink-0', ACCENT_ICON_BG[accent])}>
          {icon}
        </div>
        <p className="text-[10px] font-semibold text-nido-dusk/45 uppercase tracking-[0.1em] leading-tight">
          {label}
        </p>
      </div>

      {/* Value */}
      <p className={cn('text-3xl font-bold leading-none tracking-tight', ACCENT_VALUE[accent])}>
        {value}
      </p>

      {/* Sub-label */}
      {sub && (
        <p className="text-[11px] text-nido-dusk/40 font-medium leading-tight">{sub}</p>
      )}
    </div>
  )
}
