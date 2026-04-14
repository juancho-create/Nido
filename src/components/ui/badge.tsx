import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default:    'bg-nido-sage/20 text-nido-forest',
        common:     'bg-nido-sage/15 text-nido-forest',
        uncommon:   'bg-blue-100 text-blue-700',
        rare:       'bg-purple-100 text-purple-700',
        legendary:  'bg-amber-100 text-amber-700',
        healthy:    'bg-green-100 text-green-700',
        sick:       'bg-red-100 text-red-600',
        away:       'bg-gray-100 text-gray-500',
        locked:     'bg-gray-100 text-gray-400',
        recovering: 'bg-yellow-100 text-yellow-700',
        amber:      'bg-nido-amber/20 text-nido-amber',
        streak:     'bg-nido-gold/20 text-yellow-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
