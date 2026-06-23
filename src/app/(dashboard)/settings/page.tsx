import { createClient, createAdminClient } from '@/lib/supabase/server'
import { getQuotaInfo } from '@/lib/quota'
import SubscriptionPanel from '@/components/settings/SubscriptionPanel'
import UsagePanel from '@/components/settings/UsagePanel'
import TeamPanel from '@/components/settings/TeamPanel'
import type { TeamMemberWithProfile } from '@/types'

export const metadata = { title: 'Settings — Inkforge' }

export default async function SettingsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const adminSupabase = createAdminClient()

  const [{ data: profile }, { data: subscription }, quotaInfo] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('subscriptions').select('*').eq('user_id', user.id).single(),
    getQuotaInfo(supabase, user.id),
  ])

  let teamMembers: TeamMemberWithProfile[] = []
  if (subscription?.tier === 'studio') {
    const { data } = await adminSupabase
      .from('team_members')
      .select('*, profile:profiles!member_id(full_name, avatar_url)')
      .eq('owner_id', user.id)
      .neq('status', 'revoked')
      .order('invited_at')
    teamMembers = (data ?? []) as TeamMemberWithProfile[]
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink-50">Settings</h1>
        <p className="text-ink-400 text-sm mt-1">Manage your account and subscription</p>
      </div>

      <SubscriptionPanel subscription={subscription} userEmail={user.email ?? ''} />
      <UsagePanel quotaInfo={quotaInfo} />
      {subscription?.tier === 'studio' && (
        <TeamPanel teamMembers={teamMembers} />
      )}
    </div>
  )
}
