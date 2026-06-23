import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getStencilSignedUrl } from '@/lib/storage'
import HistoryGrid from '@/components/history/HistoryGrid'
import type { GenerationWithUrl } from '@/types'

export const metadata = { title: 'History — Inkforge' }

export default async function HistoryPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: generations } = await supabase
    .from('generations')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(100)

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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink-50">Generation history</h1>
        <p className="text-ink-400 text-sm mt-1">
          {generationsWithUrls.length} completed stencil
          {generationsWithUrls.length !== 1 ? 's' : ''}
        </p>
      </div>
      <HistoryGrid generations={generationsWithUrls} />
    </div>
  )
}
