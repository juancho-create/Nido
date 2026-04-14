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
        'flex items-center gap-3.5 rounded-3xl border p-4 transition-all duration-200',
        unlocked
          ? 'bg-white/72 border-nido-gold/25 shadow-card backdrop-blur-sm'
          : 'bg-nido-mist/40 border-nido-dusk/8 opacity-55',
      )}
    >
      {/* Icon bubble */}
      <div
        className={cn(
          'w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0',
          'transition-all duration-200',
          unlocked
            ? 'bg-nido-gold/18 shadow-gold-glow'
            : 'bg-nido-dusk/6',
        )}
      >
        <span className={cn(!unlocked && 'grayscale opacity-40')}>{icon}</span>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm font-semibold leading-snug',
            unlocked ? 'text-nido-dusk' : 'text-nido-dusk/40',
          )}
        >
          {title}
        </p>
        <p className="text-xs text-nido-dusk/45 leading-snug mt-0.5">{description}</p>

        {unlocked && unlockedDate ? (
          <p className="text-[10px] text-nido-sage font-medium mt-1 flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-nido-sage/20 inline-flex items-center justify-center text-[8px]">✓</span>
            {formatDate(unlockedDate)}
          </p>
        ) : (
          <p className="text-[10px] text-nido-dusk/30 mt-1">
            Día {unlockDays}
          </p>
        )}
      </div>

      {/* Check badge */}
      {unlocked && (
        <div className="w-6 h-6 rounded-full bg-nido-sage/18 flex items-center justify-center flex-shrink-0">
          <span className="text-[11px] text-nido-forest font-bold">✓</span>
        </div>
      )}
    </div>
  )
}
