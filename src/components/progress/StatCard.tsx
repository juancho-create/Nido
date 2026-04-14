import { GlassCard } from '@/components/shared/GlassCard'
import { cn } from '@/lib/utils/cn'

interface StatCardProps {
  icon: string
  label: string
  value: string | number
  sub?: string
  accent?: 'sage' | 'amber' | 'gold' | 'blue'
  className?: string
}

const ACCENT_COLORS = {
  sage:  'text-nido-sage',
  amber: 'text-nido-amber',
  gold:  'text-yellow-600',
  blue:  'text-blue-500',
}

export function StatCard({ icon, label, value, sub, accent = 'sage', className }: StatCardProps) {
  return (
    <GlassCard intensity="heavy" padding="md" className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <p className="text-xs text-nido-dusk/50 font-medium uppercase tracking-wide">{label}</p>
      </div>
      <p className={cn('text-3xl font-bold leading-none mt-1', ACCENT_COLORS[accent])}>
        {value}
      </p>
      {sub && <p className="text-xs text-nido-dusk/40 mt-0.5">{sub}</p>}
    </GlassCard>
  )
}
