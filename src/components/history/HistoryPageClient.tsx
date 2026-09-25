'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import HistoryGrid from './HistoryGrid'
import type { GenerationWithUrl } from '@/types'

interface HistoryPageClientProps {
  generations: GenerationWithUrl[]
  quotaUsed: number
  quotaLimit: number
  quotaTier: string
  isUnlimited: boolean
}

export default function HistoryPageClient({
  generations,
  quotaUsed,
  quotaLimit,
  quotaTier,
  isUnlimited,
}: HistoryPageClientProps) {
  const { t } = useLanguage()

  const thisMonth = generations.filter((g) => {
    const d = new Date((g as { created_at?: string }).created_at ?? '')
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const imageCount = generations.filter((g) => (g as { type?: string }).type === 'image_to_stencil').length
  const textCount = generations.filter((g) => (g as { type?: string }).type === 'text_to_stencil').length

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-ink-50">{t('history_title')}</h1>
          <p className="text-ink-300 text-sm mt-1">
            {generations.length} {generations.length !== 1 ? t('history_count_p') : t('history_count_s')}
          </p>
        </div>
      </div>

      {/* Stats tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-ink-900 border border-ink-600 rounded-xl p-4">
          <div className="font-mono text-[9px] tracking-widest uppercase text-ink-400 mb-2">{t('stat_total')}</div>
          <div className="font-playfair text-3xl font-bold text-ink-50 leading-none">{generations.length}</div>
          <div className="text-xs text-ink-300 mt-1">{t('stat_since')}</div>
        </div>
        <div className="bg-ink-900 border border-ink-600 rounded-xl p-4">
          <div className="font-mono text-[9px] tracking-widest uppercase text-ink-400 mb-2">{t('stat_this_month')}</div>
          <div className="font-playfair text-3xl font-bold text-ink-50 leading-none">{thisMonth.length}</div>
          <div className="text-xs text-ink-300 mt-1">
            {isUnlimited ? t('stat_unlimited_lbl') : `${quotaLimit - quotaUsed} ${t('stat_remaining')}`}
          </div>
        </div>
        <div className="bg-ink-900 border border-ink-600 rounded-xl p-4">
          <div className="font-mono text-[9px] tracking-widest uppercase text-ink-400 mb-2">{t('stat_plan')}</div>
          <div className="font-playfair text-3xl font-bold text-ink-50 capitalize leading-none">{quotaTier}</div>
          <div className="text-xs text-ink-300 mt-1">
            {isUnlimited ? t('stat_unlimited_lbl') : `${quotaLimit} ${t('stat_per_month')}`}
          </div>
        </div>
        <div className="bg-ink-900 border border-ink-600 rounded-xl p-4">
          <div className="font-mono text-[9px] tracking-widest uppercase text-ink-400 mb-2">{t('stat_breakdown')}</div>
          <div className="font-playfair text-3xl font-bold text-ink-50 leading-none">
            {imageCount}
            <span className="text-ink-400 text-xl"> / </span>
            {textCount}
          </div>
          <div className="text-xs text-ink-300 mt-1">{t('stat_analysis')}</div>
        </div>
      </div>

      <HistoryGrid generations={generations} />
    </div>
  )
}
