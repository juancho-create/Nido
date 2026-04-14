import { cn } from '@/lib/utils/cn'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: 'light' | 'medium' | 'heavy'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function GlassCard({
  className,
  intensity = 'medium',
  padding = 'md',
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/70 backdrop-blur-sm',
        {
          'bg-white/40': intensity === 'light',
          'bg-white/65': intensity === 'medium',
          'bg-white/85': intensity === 'heavy',
        },
        {
          'p-0':  padding === 'none',
          'p-3':  padding === 'sm',
          'p-5':  padding === 'md',
          'p-7':  padding === 'lg',
        },
        'shadow-glass',
        className,
      )}
      {...props}
    />
  )
}
