import { BottomNav } from './BottomNav'

interface AppShellProps {
  children: React.ReactNode
  hideNav?: boolean
}

export function AppShell({ children, hideNav = false }: AppShellProps) {
  return (
    <div className="relative min-h-screen w-full flex justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #FAF7F2 0%, #F5F0E8 55%, #EEF3EE 100%)',
      }}
    >
      {/* Ambient background orbs — purely decorative */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div
          className="absolute -top-32 -left-32 w-80 h-80 rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(184,212,232,0.5) 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/3 -right-24 w-72 h-72 rounded-full opacity-25 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(168,197,160,0.5) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-1/4 -left-16 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(244,196,48,0.35) 0%, transparent 70%)' }}
        />
      </div>

      {/* Main content column */}
      <div className="relative w-full max-w-[430px] min-h-screen flex flex-col overflow-hidden">
        <main className={`flex-1 ${hideNav ? '' : 'pb-28'}`}>{children}</main>
        {!hideNav && <BottomNav />}
      </div>
    </div>
  )
}
