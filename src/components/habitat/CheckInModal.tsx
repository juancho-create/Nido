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
  open: boolean
  onClose: () => void
  onConfirm: (note?: string) => void
  result: CheckInResult | null
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
      <DialogContent>
        {step === 'confirm' ? (
          <>
            <DialogHeader>
              <div className="text-4xl mb-2">🌿</div>
              <DialogTitle>¡Otro día libre!</DialogTitle>
              <DialogDescription>
                Registra tu día sin fumar. Tu nido te lo agradece.
              </DialogDescription>
            </DialogHeader>

            <Textarea
              placeholder="¿Cómo te sientes hoy? (opcional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />

            <DialogFooter>
              <Button size="lg" className="w-full" onClick={handleConfirm}>
                ¡Lo registré! 🌿
              </Button>
              <Button variant="ghost" size="md" className="w-full" onClick={handleClose}>
                Cancelar
              </Button>
            </DialogFooter>
          </>
        ) : (
          <ResultScreen result={result} onClose={handleClose} />
        )}
      </DialogContent>
    </Dialog>
  )
}

function ResultScreen({
  result, onClose,
}: {
  result: CheckInResult | null
  onClose: () => void
}) {
  if (!result) return null

  const { newStreak, rewards, newBirdsUnlocked, newAchievements, isMilestone, biomeChanged, newBiomeId } = result

  return (
    <>
      <DialogHeader>
        <div className="text-5xl mb-1 animate-bounce-gentle">
          {isMilestone ? '🎉' : '✨'}
        </div>
        <DialogTitle>
          {isMilestone ? `¡${streakLabel(newStreak)} de racha!` : `${streakLabel(newStreak)} 🔥`}
        </DialogTitle>
        <DialogDescription>
          {isMilestone
            ? '¡Un hito increíble! Tu nido brilla con tu fortaleza.'
            : 'Cada día cuenta. Tu ecosistema florece contigo.'}
        </DialogDescription>
      </DialogHeader>

      {/* Rewards */}
      <div className="rounded-2xl bg-nido-sage/10 p-4 space-y-2">
        <p className="text-xs font-semibold text-nido-sage uppercase tracking-wide">Recompensas</p>
        <div className="flex gap-3 flex-wrap">
          {rewards.seeds  && <RewardPill icon="🌱" value={rewards.seeds}  label="semillas" />}
          {rewards.food   && <RewardPill icon="🍎" value={rewards.food}   label="comida"   />}
          {rewards.gems   && <RewardPill icon="💎" value={rewards.gems}   label="gemas"    />}
        </div>
      </div>

      {/* New birds */}
      {newBirdsUnlocked.length > 0 && (
        <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">
            ¡Nueva ave!
          </p>
          {newBirdsUnlocked.map((b) => (
            <div key={b.id} className="flex items-center gap-2">
              <span className="text-2xl">{b.emoji}</span>
              <div>
                <p className="text-sm font-semibold text-nido-dusk">{b.name}</p>
                <p className="text-xs text-nido-dusk/60">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Biome upgrade */}
      {biomeChanged && newBiomeId && (
        <div className="rounded-2xl bg-nido-sky/30 border border-nido-sky/40 p-4">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
            ¡Bioma desbloqueado!
          </p>
          <p className="text-sm text-nido-dusk">Tu nido ha evolucionado ✨</p>
        </div>
      )}

      {/* Achievements */}
      {newAchievements.map((ach) => (
        <div key={ach.id} className="rounded-2xl bg-yellow-50 border border-yellow-100 p-3 flex items-center gap-3">
          <span className="text-2xl">{ach.icon}</span>
          <div>
            <p className="text-sm font-semibold text-nido-dusk">{ach.title}</p>
            <p className="text-xs text-nido-dusk/60">{ach.description}</p>
          </div>
        </div>
      ))}

      <Button size="lg" className="w-full mt-2" onClick={onClose}>
        ¡Perfecto!
      </Button>
    </>
  )
}

function RewardPill({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <div className="flex items-center gap-1 bg-white rounded-full px-3 py-1.5 text-sm font-semibold text-nido-dusk">
      <span>{icon}</span>
      <span>+{value}</span>
      <span className="text-nido-dusk/50 text-xs">{label}</span>
    </div>
  )
}
