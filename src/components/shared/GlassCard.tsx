import { cn } from '@/lib/utils/cn'

type Intensity = 'light' | 'medium' | 'heavy'
type Padding   = 'none' | 'sm' | 'md' | 'lg'
type Variant   = 'default' | 'warm' | 'nature' | 'amber' | 'relapse'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: Intensity
  padding?:   Padding
  variant?:   Variant
  /** Lift the card with a stronger shadow on mount */
  elevated?:  boolean
}

const INTENSITY: Record<Intensity, string> = {
  light:  'bg-white/40',
  medium: 'bg-white/65',
  heavy:  'bg-white/88',
}

const VARIANT_BASE: Record<Variant, string> = {
  default: 'border-white/70',
  warm:    'border-nido-sand/50 bg-nido-dawn/75',
  nature:  'border-nido-sage/18 bg-nido-sage/6',
  amber:   'border-nido-amber/20 bg-nido-amber/6',
  relapse: 'border-nido-rose/15 bg-nido-petal/50',
}

const PAD: Record<Padding, string> = {
  none: 'p-0',
  sm:   'p-3',
  md:   'p-5',
  lg:   'p-7',
}

export function GlassCard({
  className,
  intensity = 'medium',
  padding   = 'md',
  variant   = 'default',
  elevated  = false,
  ...props
}: GlassCardProps) {
  const isDefault = variant === 'default'

  return (
    <div
      className={cn(
        'rounded-3xl border backdrop-blur-sm transition-shadow duration-200',
        isDefault ? INTENSITY[intensity] : '',
        VARIANT_BASE[variant],
        PAD[padding],
        elevated ? 'shadow-glass-lg' : 'shadow-glass',
        className,
      )}
      {...props}
    />
  )
}
