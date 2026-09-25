import { createClient, createAdminClient } from '@/lib/supabase/server'
import { getQuotaInfo } from '@/lib/quota'
import SettingsPageClient from '@/components/settings/SettingsPageClient'
import type { TeamMemberWithProfile } from '@/types'

export const metadata = { title: 'Settings — Inkforge' }

export default async function SettingsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const adminSupabase = createAdminClient()

  const [{ data: subscription }, quotaInfo] = await Promise.all([
    supabase.from('subscriptions').select('*').eq('user_id', user.id).single(),
    getQuotaInfo(supabase, user.id),
  ])

  let teamMembers: TeamMemberWithProfile[] = []
  const showTeam = subscription?.tier === 'studio' || subscription?.tier === 'professional'

  if (showTeam) {
    const { data } = await adminSupabase
      .from('team_members')
      .select('*, profile:profiles!member_id(full_name, avatar_url)')
      .eq('owner_id', user.id)
      .neq('status', 'revoked')
      .order('invited_at')
    teamMembers = (data ?? []) as TeamMemberWithProfile[]
  }

  return (
    <SettingsPageClient
      subscription={subscription}
      userEmail={user.email ?? ''}
      quotaInfo={quotaInfo}
      teamMembers={teamMembers}
      showTeam={showTeam}
    />
  )
}
