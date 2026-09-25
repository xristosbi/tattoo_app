import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getStencilSignedUrl } from '@/lib/storage'
import { getQuotaInfo } from '@/lib/quota'
import HistoryPageClient from '@/components/history/HistoryPageClient'
import type { GenerationWithUrl } from '@/types'

export const metadata = { title: 'History — Inkforge' }

export default async function HistoryPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const [generationsResult, quotaInfo] = await Promise.all([
    supabase
      .from('generations')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(100),
    getQuotaInfo(supabase, user.id),
  ])

  const { data: generations } = generationsResult
  const adminSupabase = createAdminClient()

  const generationsWithUrls: GenerationWithUrl[] = await Promise.all(
    (generations ?? []).map(async (gen) => {
      if (!gen.output_storage_path) return gen
      try {
        const stencilUrl = await getStencilSignedUrl(adminSupabase, gen.output_storage_path)
        return { ...gen, stencilUrl }
      } catch {
        return gen
      }
    })
  )

  const isUnlimited = quotaInfo.limit === -1

  return (
    <HistoryPageClient
      generations={generationsWithUrls}
      quotaUsed={quotaInfo.used}
      quotaLimit={quotaInfo.limit}
      quotaTier={quotaInfo.tier}
      isUnlimited={isUnlimited}
    />
  )
}
