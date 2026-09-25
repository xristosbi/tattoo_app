'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import SubscriptionPanel from './SubscriptionPanel'
import UsagePanel from './UsagePanel'
import TeamPanel from './TeamPanel'
import type { Subscription, TeamMemberWithProfile } from '@/types'

interface SettingsPageClientProps {
  subscription: Subscription | null
  userEmail: string
  quotaInfo: {
    used: number
    limit: number
    tier: string
    periodEnd: string
  }
  teamMembers: TeamMemberWithProfile[]
  showTeam: boolean
}

export default function SettingsPageClient({
  subscription,
  userEmail,
  quotaInfo,
  teamMembers,
  showTeam,
}: SettingsPageClientProps) {
  const { t } = useLanguage()

  return (
    <div className="max-w-2xl space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink-50">{t('settings_title')}</h1>
        <p className="text-ink-400 text-sm mt-1">{t('settings_subtitle')}</p>
      </div>

      <SubscriptionPanel subscription={subscription} userEmail={userEmail} />
      <UsagePanel quotaInfo={quotaInfo} />
      {showTeam && <TeamPanel teamMembers={teamMembers} />}
    </div>
  )
}
