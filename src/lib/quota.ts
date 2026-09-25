import type { SupabaseClient } from '@supabase/supabase-js'
import type { SubscriptionTier } from '@/types'

export const QUOTA_LIMITS: Record<string, number> = {
  free: 3,
  starter: 20,
  plus: 60,
  professional: -1,
  pro: 100,
  studio: -1,
}

export function getQuotaLimit(tier: SubscriptionTier | string): number {
  return QUOTA_LIMITS[tier as string] ?? QUOTA_LIMITS.free
}

export async function checkQuota(
  supabase: SupabaseClient,
  quotaOwnerId: string
): Promise<{ allowed: boolean; remaining: number; limit: number; used: number; tier: SubscriptionTier }> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier, generations_used, generations_limit, generations_reset_at')
    .eq('id', quotaOwnerId)
    .single()

  if (!profile) {
    return { allowed: false, remaining: 0, limit: 3, used: 0, tier: 'free' }
  }

  const tier = (profile.subscription_tier ?? 'free') as SubscriptionTier
  const limit: number = profile.generations_limit ?? getQuotaLimit(tier)
  const isUnlimited = limit === -1 || limit >= 999999

  if (isUnlimited) {
    return { allowed: true, remaining: -1, limit: -1, used: profile.generations_used ?? 0, tier }
  }

  // Auto-reset if period expired
  if (new Date(profile.generations_reset_at) < new Date()) {
    const nextReset = new Date()
    nextReset.setMonth(nextReset.getMonth() + 1)
    nextReset.setDate(1)
    nextReset.setHours(0, 0, 0, 0)
    await supabase
      .from('profiles')
      .update({ generations_used: 0, generations_reset_at: nextReset.toISOString() })
      .eq('id', quotaOwnerId)
    return { allowed: true, remaining: limit, limit, used: 0, tier }
  }

  const used = profile.generations_used ?? 0
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
  await supabase.rpc('increment_profile_generation_count', { p_user_id: quotaOwnerId })
}

export async function getQuotaInfo(
  supabase: SupabaseClient,
  userId: string
): Promise<{ used: number; limit: number; tier: SubscriptionTier; periodEnd: string }> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier, generations_used, generations_limit, generations_reset_at')
    .eq('id', userId)
    .single()

  const tier = ((profile?.subscription_tier) ?? 'free') as SubscriptionTier
  const limit: number = profile?.generations_limit ?? getQuotaLimit(tier)

  return {
    used: profile?.generations_used ?? 0,
    limit,
    tier,
    periodEnd: profile?.generations_reset_at ?? new Date().toISOString(),
  }
}
