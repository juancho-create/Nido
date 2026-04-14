'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, BarChart2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const NAV_ITEMS = [
  { href: '/habitat',    label: 'Nido',      Icon: Home     },
  { href: '/collection', label: 'Colección', Icon: BookOpen },
  { href: '/progress',   label: 'Progreso',  Icon: BarChart2 },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 px-5 pb-safe-bottom">
      <div className="mb-4 rounded-[2rem] bg-white/88 backdrop-blur-xl border border-white/80 shadow-glass-lg overflow-hidden">
        <div className="flex h-[62px]">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative flex flex-1 flex-col items-center justify-center gap-0.5',
                  'transition-all duration-200',
                  active
                    ? 'text-nido-forest'
                    : 'text-nido-dusk/35 hover:text-nido-dusk/60',
                )}
              >
                {/* Active background pill */}
                {active && (
                  <span className="absolute inset-x-3 inset-y-1.5 rounded-2xl bg-nido-sage/10 animate-scale-in" />
                )}

                <Icon
                  size={20}
                  strokeWidth={active ? 2.3 : 1.6}
                  className={cn(
                    'relative transition-transform duration-200',
                    active ? 'scale-110' : '',
                  )}
                />

                <span
                  className={cn(
                    'relative text-[9.5px] font-medium tracking-wide transition-all duration-200',
                    active ? 'font-semibold text-nido-forest opacity-100' : 'opacity-70',
                  )}
                >
                  {label}
                </span>

                {/* Active dot */}
                {active && <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-nido-sage/60 animate-pop-in" />}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
