import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nido-sage focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 active:scale-95',
  {
    variants: {
      variant: {
        default:
          'bg-nido-sage text-white shadow-float hover:bg-nido-forest hover:shadow-glass-md',
        primary:
          'bg-nido-sage text-white shadow-float hover:bg-nido-forest',
        amber:
          'bg-nido-amber text-white shadow-float hover:opacity-90',
        ghost:
          'bg-transparent text-nido-dusk hover:bg-white/60',
        outline:
          'border border-nido-sage/30 bg-white/60 text-nido-forest backdrop-blur-sm hover:bg-white/80',
        glass:
          'bg-white/60 backdrop-blur-sm border border-white/70 text-nido-dusk shadow-glass hover:bg-white/80',
        danger:
          'bg-red-400/80 text-white hover:bg-red-500',
        link:
          'text-nido-sage underline-offset-4 hover:underline',
      },
      size: {
        sm:   'h-9  px-4  text-xs',
        md:   'h-11 px-5  text-sm',
        lg:   'h-14 px-8  text-base',
        xl:   'h-16 px-10 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
