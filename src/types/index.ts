export * from './database.types'

import type {
  Generation,
  SubscriptionTier,
  TeamMemberStatus,
} from './database.types'

export type GenerationState = 'idle' | 'submitting' | 'processing' | 'completed' | 'error'

export interface GenerationJob {
  generationId: string
  status: GenerationState
  stencilUrl?: string
  error?: string
}

export interface QuotaInfo {
  allowed: boolean
  used: number
  remaining: number
  limit: number
  tier: SubscriptionTier
}

export interface TeamMemberWithProfile {
  id: string
  owner_id: string
  member_id: string | null
  invite_email: string
  invite_token: string
  status: TeamMemberStatus
  invited_at: string
  accepted_at: string | null
  profile?: {
    full_name: string | null
    avatar_url: string | null
  } | null
}

export type GenerationWithUrl = Generation & { stencilUrl?: string }

export interface PricingTier {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  highlighted: boolean
  tier: SubscriptionTier
}
