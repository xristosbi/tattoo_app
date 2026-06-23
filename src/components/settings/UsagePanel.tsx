import { BarChart3 } from 'lucide-react'
import Card, { CardHeader, CardBody } from '@/components/ui/Card'
import ProgressBar from '@/components/ui/ProgressBar'
import { formatDate } from '@/lib/utils'

interface UsagePanelProps {
  quotaInfo: {
    used: number
    limit: number
    tier: string
    periodEnd: string
  }
}

export default function UsagePanel({ quotaInfo }: UsagePanelProps) {
  const isUnlimited = quotaInfo.limit === -1
  const percent = isUnlimited
    ? 0
    : Math.round((quotaInfo.used / quotaInfo.limit) * 100)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-ink-400" />
          <h2 className="font-semibold text-ink-100">Usage this month</h2>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-3xl font-bold text-ink-50">{quotaInfo.used}</span>
            {!isUnlimited && (
              <span className="text-ink-400 text-sm ml-2">/ {quotaInfo.limit}</span>
            )}
            <p className="text-xs text-ink-500 mt-0.5">stencils generated</p>
          </div>
          {!isUnlimited && (
            <span
              className={`text-sm font-medium ${
                percent >= 80 ? 'text-red-400' : 'text-ink-400'
              }`}
            >
              {percent}% used
            </span>
          )}
        </div>

        <ProgressBar value={quotaInfo.used} max={quotaInfo.limit} showLabel />

        {isUnlimited ? (
          <p className="text-xs text-ink-500">Unlimited generations on Studio plan</p>
        ) : (
          <p className="text-xs text-ink-500">
            Resets on {formatDate(quotaInfo.periodEnd)}
          </p>
        )}
      </CardBody>
    </Card>
  )
}
