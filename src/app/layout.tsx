import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nido — Deja de Fumar',
  description: 'Tu ecosistema personal para dejar de fumar. Cada día sin fumar hace crecer un nido de aves.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Nido',
  },
  keywords: ['dejar de fumar', 'salud', 'gamificación', 'bienestar'],
}

export const viewport: Viewport = {
  themeColor: '#7B9E84',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
