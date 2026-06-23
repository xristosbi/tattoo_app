import { createClient } from '@/lib/supabase/server'
import { getQuotaInfo } from '@/lib/quota'
import GeneratePageClient from '@/components/generate/GeneratePageClient'

export const metadata = { title: 'Generate — Inkforge' }

export default async function GeneratePage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const quotaInfo = await getQuotaInfo(supabase, user.id)

  return <GeneratePageClient quotaInfo={quotaInfo} />
}
