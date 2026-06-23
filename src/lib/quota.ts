import type { SupabaseClient } from '@supabase/supabase-js'
import type { SubscriptionTier } from '@/types'

export const QUOTA_LIMITS: Record<SubscriptionTier, number> = {
  free: 5,
  pro: 100,
  studio: -1, // -1 = unlimited
}

export function getQuotaLimit(tier: SubscriptionTier | string): number {
  return QUOTA_LIMITS[tier as SubscriptionTier] ?? QUOTA_LIMITS.free
}

export async function getSubscriptionTier(
  supabase: SupabaseClient,
  userId: string
): Promise<SubscriptionTier> {
  const { data } = await supabase
    .from('subscriptions')
    .select('tier')
    .eq('user_id', userId)
    .single()
  return (data?.tier ?? 'free') as SubscriptionTier
}

async function resetQuotaIfExpired(supabase: SupabaseClient, userId: string) {
  const { data: quota } = await supabase
    .from('generation_quotas')
    .select('period_end')
    .eq('user_id', userId)
    .single()

  if (!quota) return

  if (new Date(quota.period_end) < new Date()) {
    const now = new Date()
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    await supabase
      .from('generation_quotas')
      .update({
        count: 0,
        period_start: periodStart.toISOString(),
        period_end: periodEnd.toISOString(),
      })
      .eq('user_id', userId)
  }
}

export async function checkQuota(
  supabase: SupabaseClient,
  quotaOwnerId: string
): Promise<{ allowed: boolean; remaining: number; limit: number; used: number; tier: SubscriptionTier }> {
  const tier = await getSubscriptionTier(supabase, quotaOwnerId)
  const limit = getQuotaLimit(tier)

  if (limit === -1) {
    return { allowed: true, remaining: -1, limit: -1, used: 0, tier }
  }

  await resetQuotaIfExpired(supabase, quotaOwnerId)

  const { data: quota } = await supabase
    .from('generation_quotas')
    .select('count')
    .eq('user_id', quotaOwnerId)
    .single()

  const used = quota?.count ?? 0
  return {
    allowed: used < limit,
    remaining: Math.max(0, limit - used),
    limit,
    used,
    tier,
  }
}

export async function incrementQuota(
  supabase: SupabaseClient,
  quotaOwnerId: string
): Promise<void> {
  await supabase.rpc('increment_generation_count', { p_user_id: quotaOwnerId })
}

export async function getQuotaInfo(
  supabase: SupabaseClient,
  userId: string
): Promise<{ used: number; limit: number; tier: SubscriptionTier; periodEnd: string }> {
  const tier = await getSubscriptionTier(supabase, userId)
  const limit = getQuotaLimit(tier)

  const { data: quota } = await supabase
    .from('generation_quotas')
    .select('count, period_end')
    .eq('user_id', userId)
    .single()

  return {
    used: quota?.count ?? 0,
    limit,
    tier,
    periodEnd: quota?.period_end ?? new Date().toISOString(),
  }
}
