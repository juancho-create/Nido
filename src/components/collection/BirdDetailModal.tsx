'use client'

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { Bird } from '@/lib/types'
import { formatDate } from '@/lib/utils/dates'

const RARITY_LABELS = {
  common:    'Común',
  uncommon:  'Poco común',
  rare:      'Raro',
  legendary: 'Legendario',
}

interface BirdDetailModalProps {
  bird: Bird
  open: boolean
  onClose: () => void
  onFeed?: (id: string) => void
  canFeed?: boolean
}

export function BirdDetailModal({ bird, open, onClose, onFeed, canFeed }: BirdDetailModalProps) {
  const isLocked = bird.status === 'locked'

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <span
              className={`text-5xl ${isLocked ? 'grayscale opacity-30' : ''}`}
            >
              {isLocked ? '🔒' : bird.emoji}
            </span>
            <div>
              <DialogTitle className="text-left">
                {isLocked ? 'Ave bloqueada' : bird.name}
              </DialogTitle>
              {!isLocked && (
                <p className="text-xs text-nido-dusk/50 italic">{bird.species}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Badge variant={bird.rarity}>{RARITY_LABELS[bird.rarity]}</Badge>
            {!isLocked && (
              <Badge variant={bird.status as any}>
                {statusLabel(bird.status)}
              </Badge>
            )}
          </div>
        </DialogHeader>

        {isLocked ? (
          <div className="space-y-3">
            <p className="text-sm text-nido-dusk/60 leading-relaxed">{bird.description}</p>
            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 text-center">
              <p className="text-2xl mb-1">🔒</p>
              <p className="text-sm font-semibold text-gray-500">
                Se desbloquea en el día {bird.unlockDays}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Sigue registrando días sin fumar
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <DialogDescription className="leading-relaxed">
              {bird.description}
            </DialogDescription>

            {/* Lore */}
            <div className="rounded-2xl bg-nido-sage/8 border border-nido-sage/15 p-4">
              <p className="text-xs font-semibold text-nido-sage uppercase tracking-wide mb-1.5">Historia</p>
              <p className="text-sm text-nido-dusk/70 leading-relaxed italic">"{bird.lore}"</p>
            </div>

            {/* Stats */}
            {bird.status !== 'away' && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-nido-dusk/50 uppercase tracking-wide">Estado</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-nido-dusk/60">
                    <span>Saciedad</span>
                    <span>{bird.hungerLevel}%</span>
                  </div>
                  <Progress
                    value={bird.hungerLevel}
                    indicatorClassName={
                      bird.hungerLevel < 30 ? 'bg-red-400' :
                      bird.hungerLevel < 60 ? 'bg-nido-amber' : 'bg-nido-sage'
                    }
                  />
                </div>
              </div>
            )}

            {bird.unlockedDate && (
              <p className="text-xs text-nido-dusk/40">
                Llegó a tu nido el {formatDate(bird.unlockedDate)}
              </p>
            )}
          </div>
        )}

        <DialogFooter>
          {!isLocked && canFeed && bird.status !== 'away' && (
            <Button
              size="lg"
              className="w-full"
              onClick={() => { onFeed?.(bird.id); onClose() }}
            >
              Alimentar 🌱 {bird.feedCost} semillas
            </Button>
          )}
          <Button variant="ghost" size="md" className="w-full" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function statusLabel(status: Bird['status']): string {
  const map: Record<Bird['status'], string> = {
    healthy:    'Sano',
    sick:       'Enfermo',
    away:       'Ausente',
    recovering: 'Mejorando',
    locked:     'Bloqueado',
  }
  return map[status]
}
