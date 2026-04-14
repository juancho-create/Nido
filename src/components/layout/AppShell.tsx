import { BottomNav } from './BottomNav'

interface AppShellProps {
  children: React.ReactNode
  hideNav?: boolean
}

export function AppShell({ children, hideNav = false }: AppShellProps) {
  return (
    <div className="relative min-h-screen w-full bg-nido-cream flex justify-center">
      <div className="relative w-full max-w-[430px] min-h-screen flex flex-col overflow-hidden">
        <main className={`flex-1 ${hideNav ? '' : 'pb-28'}`}>{children}</main>
        {!hideNav && <BottomNav />}
      </div>
    </div>
  )
}
