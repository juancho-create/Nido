'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, BarChart2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const NAV_ITEMS = [
  { href: '/habitat',    label: 'Nido',      Icon: Home        },
  { href: '/collection', label: 'Colección', Icon: BookOpen    },
  { href: '/progress',   label: 'Progreso',  Icon: BarChart2   },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 px-4 pb-safe-bottom">
      <div className="mb-3 rounded-3xl bg-white/80 backdrop-blur-md border border-white/80 shadow-glass-md">
        <div className="flex">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-1 flex-col items-center gap-1 py-3.5 transition-colors',
                  active
                    ? 'text-nido-sage'
                    : 'text-nido-dusk/40 hover:text-nido-dusk/70',
                )}
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2.2 : 1.7}
                  className="transition-transform active:scale-90"
                />
                <span
                  className={cn(
                    'text-[10px] font-medium',
                    active ? 'font-semibold' : '',
                  )}
                >
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
