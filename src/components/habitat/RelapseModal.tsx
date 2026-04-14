'use client'

import { useState } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { RelapseResult } from '@/lib/types'

interface RelapseModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (note?: string) => void
  result: RelapseResult | null
}

export function RelapseModal({ open, onClose, onConfirm, result }: RelapseModalProps) {
  const [note, setNote] = useState('')
  const [step, setStep] = useState<'confirm' | 'result'>('confirm')

  function handleConfirm() {
    onConfirm(note || undefined)
    setStep('result')
  }

  function handleClose() {
    setStep('confirm')
    setNote('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent>
        {step === 'confirm' ? (
          <>
            <DialogHeader>
              <div className="text-4xl mb-2">🍃</div>
              <DialogTitle>Un tropiezo en el camino</DialogTitle>
              <DialogDescription>
                Está bien. Un tropiezo no borra tu camino. ¿Quieres registrarlo
                con honestidad? Eso también es valentía.
              </DialogDescription>
            </DialogHeader>

            <Textarea
              placeholder="¿Qué pasó? ¿Qué sentías? (opcional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />

            <DialogFooter>
              <Button variant="outline" size="lg" className="w-full" onClick={handleConfirm}>
                Registrar con honestidad
              </Button>
              <Button variant="ghost" size="md" className="w-full" onClick={handleClose}>
                Cancelar
              </Button>
            </DialogFooter>
          </>
        ) : (
          <RelapseResultScreen result={result} onClose={handleClose} />
        )}
      </DialogContent>
    </Dialog>
  )
}

function RelapseResultScreen({
  result, onClose,
}: {
  result: RelapseResult | null
  onClose: () => void
}) {
  if (!result) return null
  const { birdLeft, birdSick, streakLost } = result

  return (
    <>
      <DialogHeader>
        <div className="text-4xl mb-2">🌱</div>
        <DialogTitle>Empezamos de nuevo</DialogTitle>
        <DialogDescription>
          Tuviste {streakLost > 0 ? `${streakLost} días increíbles` : 'un comienzo valiente'}.
          {' '}Tu progreso total no desaparece. El camino sigue.
        </DialogDescription>
      </DialogHeader>

      {/* Compassionate message */}
      <div className="rounded-2xl bg-nido-sage/10 p-4 space-y-1.5">
        <p className="text-sm text-nido-forest font-medium">
          "Las recaídas son parte del proceso para la mayoría de las personas.
          No eres débil — eres humano."
        </p>
      </div>

      {/* Birds affected */}
      {(birdLeft || birdSick) && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-nido-dusk/50 uppercase tracking-wide">
            Tu nido lo siente
          </p>
          {birdLeft && (
            <div className="flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-100 p-3">
              <span className="text-xl opacity-40">{birdLeft.emoji}</span>
              <div>
                <p className="text-sm font-semibold text-gray-500">{birdLeft.name}</p>
                <p className="text-xs text-gray-400">Voló lejos… volverá cuando lo cuides</p>
              </div>
            </div>
          )}
          {birdSick && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 p-3">
              <span className="text-xl grayscale">{birdSick.emoji}</span>
              <div>
                <p className="text-sm font-semibold text-red-500">{birdSick.name}</p>
                <p className="text-xs text-red-400">Necesita cuidado — aliméntala para que mejore</p>
              </div>
            </div>
          )}
        </div>
      )}

      <p className="text-sm text-center text-nido-dusk/60 px-2">
        Mañana es un nuevo día. Tu nido espera.
      </p>

      <Button size="lg" className="w-full" onClick={onClose}>
        Empezar de nuevo 🌱
      </Button>
    </>
  )
}
