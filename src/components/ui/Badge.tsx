import { cn, tierLabel, tierColor } from '@/lib/utils'
import type { SubscriptionTier } from '@/types'

interface BadgeProps {
  tier: SubscriptionTier
  className?: string
}

export function TierBadge({ tier, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
        tierColor(tier),
        className
      )}
    >
      {tierLabel(tier)}
    </span>
  )
}

interface StatusBadgeProps {
  status: 'active' | 'past_due' | 'canceled' | 'trialing' | string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles: Record<string, string> = {
    active: 'text-green-400 bg-green-500/10 border-green-500/30',
    trialing: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    past_due: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    canceled: 'text-ink-400 bg-ink-700 border-ink-600',
    paused: 'text-ink-400 bg-ink-700 border-ink-600',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
        styles[status] ?? 'text-ink-400 bg-ink-700 border-ink-600',
        className
      )}
    >
      {status.replace(/_/g, ' ')}
    </span>
  )
}
