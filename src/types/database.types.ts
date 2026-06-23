export type SubscriptionTier = 'free' | 'pro' | 'studio'
export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'past_due'
  | 'trialing'
  | 'incomplete'
  | 'incomplete_expired'
  | 'unpaid'
  | 'paused'
export type GenerationType = 'image_to_stencil' | 'text_to_stencil'
export type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed'
export type TeamMemberStatus = 'pending' | 'active' | 'revoked'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  stripe_price_id: string | null
  tier: SubscriptionTier
  status: SubscriptionStatus
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export interface GenerationQuota {
  id: string
  user_id: string
  count: number
  period_start: string
  period_end: string
  created_at: string
  updated_at: string
}

export interface Generation {
  id: string
  user_id: string
  quota_owner_id: string
  type: GenerationType
  status: GenerationStatus
  prompt: string | null
  input_storage_path: string | null
  output_storage_path: string | null
  replicate_id: string | null
  error_message: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  owner_id: string
  member_id: string | null
  invite_email: string
  invite_token: string
  status: TeamMemberStatus
  invited_at: string
  accepted_at: string | null
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> }
      subscriptions: { Row: Subscription; Insert: Partial<Subscription>; Update: Partial<Subscription> }
      generation_quotas: { Row: GenerationQuota; Insert: Partial<GenerationQuota>; Update: Partial<GenerationQuota> }
      generations: { Row: Generation; Insert: Partial<Generation>; Update: Partial<Generation> }
      team_members: { Row: TeamMember; Insert: Partial<TeamMember>; Update: Partial<TeamMember> }
    }
    Functions: {
      increment_generation_count: { Args: { p_user_id: string }; Returns: void }
    }
  }
}
