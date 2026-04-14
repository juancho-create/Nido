'use client'

import { useState } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils/cn'
import type { RelapseResult } from '@/lib/types'

interface RelapseModalProps {
  open:      boolean
  onClose:   () => void
  onConfirm: (note?: string) => void
  result:    RelapseResult | null
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
      <DialogContent className="border-nido-rose/15 bg-gradient-to-b from-nido-dawn to-nido-petal/30">
        {step === 'confirm' ? (
          <ConfirmStep
            note={note}
            setNote={setNote}
            onConfirm={handleConfirm}
            onClose={handleClose}
          />
        ) : (
          <RelapseResultScreen result={result} onClose={handleClose} />
        )}
      </DialogContent>
    </Dialog>
  )
}

// ─── Confirm step ─────────────────────────────────────────────────────────────

function ConfirmStep({
  note, setNote, onConfirm, onClose,
}: {
  note: string
  setNote: (v: string) => void
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <div className="animate-slide-up space-y-5">
      <DialogHeader>
        {/* Gentle leaf icon in a warm bubble */}
        <div className="mx-auto w-14 h-14 rounded-3xl bg-nido-rose/10 border border-nido-rose/15 flex items-center justify-center mb-1">
          <span className="text-3xl">🍃</span>
        </div>
        <DialogTitle className="text-center text-nido-dusk">
          Un tropiezo en el camino
        </DialogTitle>
        <DialogDescription className="text-center text-nido-dusk/60 leading-relaxed">
          Está bien. Un tropiezo no borra lo que has construido.
          Registrarlo con honestidad también es un acto de valentía.
        </DialogDescription>
      </DialogHeader>

      {/* Optional note */}
      <div className="space-y-1.5">
        <label className="section-label pl-1">¿Qué pasó? (opcional)</label>
        <Textarea
          placeholder="¿Cómo te sentías? ¿Qué desencadenó este momento?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="resize-none rounded-2xl border-nido-dusk/12 bg-white/60 placeholder:text-nido-dusk/30 focus:border-nido-rose/30 focus:ring-nido-rose/20"
        />
      </div>

      {/* Encouragement quote */}
      <div className="rounded-2xl bg-nido-dawn/80 border border-nido-sand/40 px-4 py-3">
        <p className="text-xs text-nido-bark leading-relaxed italic">
          "Cada intento cuenta. El camino de dejar de fumar rara vez es una línea recta."
        </p>
      </div>

      <DialogFooter className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="lg"
          className="w-full rounded-2xl border-nido-rose/25 text-nido-rose hover:bg-nido-rose/5 hover:border-nido-rose/40"
          onClick={onConfirm}
        >
          Registrar con honestidad
        </Button>
        <Button
          variant="ghost"
          size="md"
          className="w-full text-nido-dusk/50 hover:text-nido-dusk/70"
          onClick={onClose}
        >
          Cancelar
        </Button>
      </DialogFooter>
    </div>
  )
}

// ─── Result screen ────────────────────────────────────────────────────────────

function RelapseResultScreen({
  result, onClose,
}: {
  result: RelapseResult | null
  onClose: () => void
}) {
  if (!result) return null
  const { birdLeft, birdSick, streakLost } = result

  return (
    <div className="animate-slide-up space-y-5">
      <DialogHeader>
        <div className="mx-auto w-14 h-14 rounded-3xl bg-nido-sage/12 border border-nido-sage/20 flex items-center justify-center mb-1 animate-float-slow">
          <span className="text-3xl">🌱</span>
        </div>
        <DialogTitle className="text-center text-nido-dusk">
          Empezamos de nuevo
        </DialogTitle>
        <DialogDescription className="text-center text-nido-dusk/60 leading-relaxed">
          {streakLost > 0
            ? `Tuviste ${streakLost} día${streakLost !== 1 ? 's' : ''} increíbles.`
            : 'Un comienzo valiente.'}{' '}
          Tu progreso total no desaparece — el camino sigue aquí.
        </DialogDescription>
      </DialogHeader>

      {/* Compassionate quote */}
      <div className="rounded-2xl bg-nido-sage/8 border border-nido-sage/15 px-4 py-3.5">
        <p className="text-sm text-nido-forest font-medium leading-relaxed">
          "Las recaídas son parte del proceso para la mayoría de las personas.
          No eres débil — eres humano."
        </p>
      </div>

      {/* Birds affected */}
      {(birdLeft || birdSick) && (
        <div className="space-y-2">
          <p className="section-label pl-1">Tu nido lo siente</p>

          {birdLeft && (
            <div className={cn(
              'flex items-center gap-3 rounded-2xl px-3.5 py-3',
              'bg-nido-mist/60 border border-nido-dusk/8',
            )}>
              <div className="w-10 h-10 rounded-xl bg-nido-dusk/8 flex items-center justify-center">
                <span className="text-xl opacity-35">{birdLeft.emoji}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-nido-dusk/55">{birdLeft.name}</p>
                <p className="text-xs text-nido-dusk/40 mt-0.5">Voló lejos… volverá cuando lo cuides</p>
              </div>
            </div>
          )}

          {birdSick && (
            <div className={cn(
              'flex items-center gap-3 rounded-2xl px-3.5 py-3',
              'bg-nido-petal/60 border border-nido-rose/15',
            )}>
              <div className="w-10 h-10 rounded-xl bg-nido-rose/10 flex items-center justify-center">
                <span className="text-xl grayscale opacity-60">{birdSick.emoji}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-nido-rose">{birdSick.name}</p>
                <p className="text-xs text-nido-rose/60 mt-0.5">Necesita cuidado — aliméntala para que mejore</p>
              </div>
            </div>
          )}
        </div>
      )}

      <p className="text-sm text-center text-nido-dusk/50 leading-relaxed px-2">
        Mañana es un nuevo amanecer. Tu nido espera con paciencia.
      </p>

      <Button
        size="lg"
        className="w-full rounded-2xl bg-nido-sage hover:bg-nido-forest shadow-sage-glow"
        onClick={onClose}
      >
        <span className="text-lg">🌱</span>
        Empezar de nuevo
      </Button>
    </div>
  )
}
