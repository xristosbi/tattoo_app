import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max: number
  className?: string
  showLabel?: boolean
}

export default function ProgressBar({ value, max, className, showLabel }: ProgressBarProps) {
  const isUnlimited = max === -1
  const percent = isUnlimited ? 0 : Math.min(100, Math.round((value / max) * 100))
  const isNearLimit = percent >= 80

  return (
    <div className={cn('space-y-1.5', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-ink-400">
          <span>{isUnlimited ? `${value} used` : `${value} / ${max} used`}</span>
          {!isUnlimited && <span>{percent}%</span>}
        </div>
      )}
      <div className="w-full h-1.5 bg-ink-700 rounded-full overflow-hidden">
        {isUnlimited ? (
          <div className="h-full w-full bg-forge-300/20 rounded-full" />
        ) : (
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              isNearLimit ? 'bg-red-400' : 'bg-forge-300'
            )}
            style={{ width: `${percent}%` }}
          />
        )}
      </div>
    </div>
  )
}
