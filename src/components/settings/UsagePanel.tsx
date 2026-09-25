'use client'

import { BarChart3 } from 'lucide-react'
import Card, { CardHeader, CardBody } from '@/components/ui/Card'
import ProgressBar from '@/components/ui/ProgressBar'
import { formatDate } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'

interface UsagePanelProps {
  quotaInfo: {
    used: number
    limit: number
    tier: string
    periodEnd: string
  }
}

export default function UsagePanel({ quotaInfo }: UsagePanelProps) {
  const { t } = useLanguage()
  const isUnlimited = quotaInfo.limit === -1 || quotaInfo.limit >= 999999
  const percent = isUnlimited
    ? 0
    : Math.round((quotaInfo.used / quotaInfo.limit) * 100)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-ink-400" />
          <h2 className="font-semibold text-ink-100">{t('usage_title')}</h2>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-3xl font-bold text-ink-50">{quotaInfo.used}</span>
            {!isUnlimited && (
              <span className="text-ink-400 text-sm ml-2">/ {quotaInfo.limit}</span>
            )}
            <p className="text-xs text-ink-500 mt-0.5">{t('stencils_generated')}</p>
          </div>
          {!isUnlimited && (
            <span
              className={`text-sm font-medium ${
                percent >= 80 ? 'text-red-400' : 'text-ink-400'
              }`}
            >
              {percent}% {t('percent_used')}
            </span>
          )}
        </div>

        <ProgressBar value={quotaInfo.used} max={isUnlimited ? 1 : quotaInfo.limit} showLabel />

        {isUnlimited ? (
          <p className="text-xs text-ink-500">{t('unlimited_plan_desc')}</p>
        ) : (
          <p className="text-xs text-ink-500">
            {t('resets_on')} {formatDate(quotaInfo.periodEnd)}
          </p>
        )}
      </CardBody>
    </Card>
  )
}
