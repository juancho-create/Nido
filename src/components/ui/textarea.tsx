import * as React from 'react'
import { cn } from '@/lib/utils/cn'

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        'flex min-h-[88px] w-full rounded-2xl border border-nido-sage/20 bg-white/70 px-4 py-3',
        'text-sm text-nido-dusk placeholder:text-nido-dusk/40 resize-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nido-sage/40',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
)
Textarea.displayName = 'Textarea'

export { Textarea }
