'use client'

import { useState } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { CheckInResult } from '@/lib/types'
import { streakLabel } from '@/lib/utils/rewards'

interface CheckInModalProps {
  open:      boolean
  onClose:   () => void
  onConfirm: (note?: string) => void
  result:    CheckInResult | null
}

export function CheckInModal({ open, onClose, onConfirm, result }: CheckInModalProps) {
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
      <DialogContent className="border-nido-sage/15 bg-gradient-to-b from-nido-dawn to-white/80">
        {step === 'confirm' ? (
          <ConfirmStep
            note={note}
            setNote={setNote}
            onConfirm={handleConfirm}
            onClose={handleClose}
          />
        ) : (
          <ResultScreen result={result} onClose={handleClose} />
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
        <div className="mx-auto w-14 h-14 rounded-3xl bg-nido-sage/12 border border-nido-sage/20 flex items-center justify-center mb-1">
          <span className="text-3xl">🌿</span>
        </div>
        <DialogTitle className="text-center text-nido-dusk">
          ¡Otro día libre!
        </DialogTitle>
        <DialogDescription className="text-center text-nido-dusk/60 leading-relaxed">
          Registra tu día sin fumar. Cada día que cuidas tu nido cuenta.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-1.5">
        <label className="section-label pl-1">¿Cómo te sientes hoy? (opcional)</label>
        <Textarea
          placeholder="Un pensamiento, una emoción, algo que quieras recordar…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="resize-none rounded-2xl border-nido-dusk/12 bg-white/60 placeholder:text-nido-dusk/30 focus:border-nido-sage/30 focus:ring-nido-sage/20"
        />
      </div>

      <DialogFooter className="flex flex-col gap-2">
        <Button
          size="lg"
          className="w-full rounded-2xl bg-nido-sage hover:bg-nido-forest shadow-sage-glow"
          onClick={onConfirm}
        >
          <span className="text-lg">🌿</span>
          ¡Lo registré!
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

function ResultScreen({ result, onClose }: { result: CheckInResult | null; onClose: () => void }) {
  if (!result) return null

  const { newStreak, rewards, newBirdsUnlocked, newAchievements, isMilestone, biomeChanged } = result

  return (
    <div className="animate-slide-up space-y-4">
      <DialogHeader>
        <div className="mx-auto w-14 h-14 rounded-3xl bg-nido-gold/15 border border-nido-gold/25 flex items-center justify-center mb-1">
          <span className="text-3xl animate-bounce-gentle">
            {isMilestone ? '🎉' : '✨'}
          </span>
        </div>
        <DialogTitle className="text-center text-nido-dusk">
          {isMilestone ? `¡${streakLabel(newStreak)} de racha!` : `${streakLabel(newStreak)} 🔥`}
        </DialogTitle>
        <DialogDescription className="text-center text-nido-dusk/60 leading-relaxed">
          {isMilestone
            ? '¡Un hito increíble! Tu nido brilla con tu fortaleza.'
            : 'Cada día cuenta. Tu ecosistema florece contigo.'}
        </DialogDescription>
      </DialogHeader>

      {/* Rewards */}
      <div className="rounded-2xl bg-nido-sage/8 border border-nido-sage/12 px-4 py-3.5">
        <p className="text-[10px] font-semibold text-nido-sage uppercase tracking-wide mb-2.5">
          Recompensas del día
        </p>
        <div className="flex gap-2 flex-wrap">
          {rewards.seeds && <RewardPill icon="🌱" value={rewards.seeds}  label="semillas" />}
          {rewards.food  && <RewardPill icon="🍎" value={rewards.food}   label="comida"   />}
          {rewards.gems  && <RewardPill icon="💎" value={rewards.gems}   label="gemas"    />}
        </div>
      </div>

      {/* New birds */}
      {newBirdsUnlocked.length > 0 && (
        <div className="rounded-2xl bg-nido-gold/10 border border-nido-gold/20 p-4">
          <p className="text-[10px] font-semibold text-yellow-700 uppercase tracking-wide mb-2.5">
            ¡Nueva ave desbloqueada!
          </p>
          {newBirdsUnlocked.map((b) => (
            <div key={b.id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-nido-gold/20 flex items-center justify-center text-2xl flex-shrink-0">
                {b.emoji}
              </div>
              <div>
                <p className="text-sm font-semibold text-nido-dusk">{b.name}</p>
                <p className="text-xs text-nido-dusk/55">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Biome upgrade */}
      {biomeChanged && (
        <div className="rounded-2xl bg-nido-sky/20 border border-nido-sky/30 p-4">
          <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide mb-1">
            ¡Bioma evolucionado!
          </p>
          <p className="text-sm text-nido-dusk">Tu nido ha alcanzado un nuevo hábitat ✨</p>
        </div>
      )}

      {/* Achievements */}
      {newAchievements.map((ach) => (
        <div
          key={ach.id}
          className="rounded-2xl bg-nido-gold/10 border border-nido-gold/18 p-3.5 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-nido-gold/18 flex items-center justify-center text-xl flex-shrink-0">
            {ach.icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-nido-dusk">{ach.title}</p>
            <p className="text-xs text-nido-dusk/55 mt-0.5">{ach.description}</p>
          </div>
        </div>
      ))}

      <Button
        size="lg"
        className="w-full rounded-2xl bg-nido-sage hover:bg-nido-forest shadow-sage-glow"
        onClick={onClose}
      >
        ¡Perfecto!
      </Button>
    </div>
  )
}

function RewardPill({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-white/80 rounded-full px-3 py-1.5 border border-white/90 shadow-glass">
      <span className="text-sm">{icon}</span>
      <span className="text-sm font-bold text-nido-dusk">+{value}</span>
      <span className="text-[10px] text-nido-dusk/45 font-medium">{label}</span>
    </div>
  )
}
