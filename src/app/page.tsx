'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useNidoStore } from '@/lib/store/useNidoStore'

/**
 * Root page: redirects to /onboarding if not yet onboarded,
 * otherwise to /habitat. Shows nothing during hydration.
 */
export default function RootPage() {
  const router = useRouter()
  const isOnboarded = useNidoStore((s) => s.isOnboarded)

  useEffect(() => {
    router.replace(isOnboarded ? '/habitat' : '/onboarding')
  }, [isOnboarded, router])

  return (
    <div className="min-h-screen bg-nido-cream flex items-center justify-center">
      <span className="text-5xl animate-float">🪺</span>
    </div>
  )
}
