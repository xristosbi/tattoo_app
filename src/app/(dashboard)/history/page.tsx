import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getStencilSignedUrl } from '@/lib/storage'
import { getQuotaInfo } from '@/lib/quota'
import HistoryGrid from '@/components/history/HistoryGrid'
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

  const thisMonth = generationsWithUrls.filter((g) => {
    const d = new Date((g as { created_at?: string }).created_at ?? '')
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const isUnlimited = quotaInfo.limit === -1

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-ink-50">Ιστορικό</h1>
          <p className="text-ink-300 text-sm mt-1">
            {generationsWithUrls.length} ολοκληρωμέν{generationsWithUrls.length !== 1 ? 'α' : 'ο'} στένσιλ
          </p>
        </div>
      </div>

      {/* Stats tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-ink-900 border border-ink-600 rounded-xl p-4">
          <div className="font-mono text-[9px] tracking-widest uppercase text-ink-400 mb-2">Σύνολο</div>
          <div className="font-playfair text-3xl font-bold text-ink-50 leading-none">{generationsWithUrls.length}</div>
          <div className="text-xs text-ink-300 mt-1">από την εγγραφή</div>
        </div>
        <div className="bg-ink-900 border border-ink-600 rounded-xl p-4">
          <div className="font-mono text-[9px] tracking-widest uppercase text-ink-400 mb-2">Αυτόν τον μήνα</div>
          <div className="font-playfair text-3xl font-bold text-ink-50 leading-none">{thisMonth.length}</div>
          <div className="text-xs text-ink-300 mt-1">
            {isUnlimited ? 'απεριόριστο' : `${quotaInfo.limit - quotaInfo.used} απομένουν`}
          </div>
        </div>
        <div className="bg-ink-900 border border-ink-600 rounded-xl p-4">
          <div className="font-mono text-[9px] tracking-widest uppercase text-ink-400 mb-2">Πλάνο</div>
          <div className="font-playfair text-3xl font-bold text-ink-50 capitalize leading-none">{quotaInfo.tier}</div>
          <div className="text-xs text-ink-300 mt-1">
            {isUnlimited ? 'απεριόριστο' : `${quotaInfo.limit}/μήνα`}
          </div>
        </div>
        <div className="bg-ink-900 border border-ink-600 rounded-xl p-4">
          <div className="font-mono text-[9px] tracking-widest uppercase text-ink-400 mb-2">Εικόνα / Κείμενο</div>
          <div className="font-playfair text-3xl font-bold text-ink-50 leading-none">
            {generationsWithUrls.filter((g) => (g as { type?: string }).type === 'image_to_stencil').length}
            <span className="text-ink-400 text-xl"> / </span>
            {generationsWithUrls.filter((g) => (g as { type?: string }).type === 'text_to_stencil').length}
          </div>
          <div className="text-xs text-ink-300 mt-1">ανάλυση</div>
        </div>
      </div>

      <HistoryGrid generations={generationsWithUrls} />
    </div>
  )
}
