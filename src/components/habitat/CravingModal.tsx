'use client'

import { useState } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface CravingModalProps {
  open: boolean
  onClose: () => void
  onResisted: () => void
  onRelapse: () => void
}

const TIPS = [
  { icon: '🫁', text: 'Respira hondo 4 veces. Inhala 4 segundos, aguanta 4, exhala 4.' },
  { icon: '💧', text: 'Bebe un vaso de agua fría. El antojo dura solo 3-5 minutos.' },
  { icon: '🚶', text: 'Sal a caminar 5 minutos. El movimiento cambia el estado mental.' },
  { icon: '🎵', text: 'Pon tu canción favorita y escúchala completa.' },
  { icon: '📱', text: 'Llama a alguien de confianza. No tienes que estar solo en esto.' },
]

export function CravingModal({ open, onClose, onResisted, onRelapse }: CravingModalProps) {
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)])

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <div className="text-4xl mb-2">⚡</div>
          <DialogTitle>Antojo detectado</DialogTitle>
          <DialogDescription>
            Este momento es temporal. Puede durar solo 3–5 minutos.
            Tu nido confía en ti.
          </DialogDescription>
        </DialogHeader>

        {/* Tip */}
        <div className="rounded-2xl bg-nido-sky/25 border border-nido-sky/30 p-4 flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">{tip.icon}</span>
          <p className="text-sm text-nido-dusk leading-relaxed">{tip.text}</p>
        </div>

        {/* Reward preview */}
        <div className="rounded-2xl bg-nido-gold/10 border border-nido-gold/20 p-3 flex items-center gap-2">
          <span className="text-lg">🎁</span>
          <p className="text-sm text-nido-dusk">
            Si resistes: <strong>+8 🌱 semillas</strong> y <strong>+1 💎 gema</strong>
          </p>
        </div>

        <DialogFooter>
          <Button size="lg" className="w-full" onClick={onResisted}>
            ¡Lo resistí! 💪
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-nido-dusk/40 text-xs"
            onClick={onRelapse}
          >
            Cedí al antojo…
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
