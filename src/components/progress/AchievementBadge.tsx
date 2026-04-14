import { cn } from '@/lib/utils/cn'
import type { Achievement } from '@/lib/types'
import { formatDate } from '@/lib/utils/dates'

interface AchievementBadgeProps {
  achievement: Achievement
}

export function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const { unlocked, icon, title, description, unlockedDate, unlockDays } = achievement

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl p-4 border transition-all',
        unlocked
          ? 'bg-white/70 border-nido-sage/20 backdrop-blur-sm'
          : 'bg-gray-50/50 border-gray-100 opacity-60',
      )}
    >
      <div
        className={cn(
          'w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0',
          unlocked ? 'bg-nido-gold/15' : 'bg-gray-100',
        )}
      >
        <span className={cn(!unlocked && 'grayscale opacity-50')}>{icon}</span>
      </div>

      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-semibold', unlocked ? 'text-nido-dusk' : 'text-gray-400')}>
          {title}
        </p>
        <p className="text-xs text-nido-dusk/50 leading-snug mt-0.5">{description}</p>
        {unlocked && unlockedDate ? (
          <p className="text-[10px] text-nido-sage mt-1">
            ✓ Desbloqueado el {formatDate(unlockedDate)}
          </p>
        ) : (
          <p className="text-[10px] text-gray-400 mt-1">
            Día {unlockDays}
          </p>
        )}
      </div>

      {unlocked && (
        <div className="w-5 h-5 rounded-full bg-nido-sage/20 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] text-nido-sage font-bold">✓</span>
        </div>
      )}
    </div>
  )
}
