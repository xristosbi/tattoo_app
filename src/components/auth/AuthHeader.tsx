'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import type { TranslationKey } from '@/i18n/translations'

interface AuthHeaderProps {
  titleKey: TranslationKey
  subtitleKey: TranslationKey
}

export default function AuthHeader({ titleKey, subtitleKey }: AuthHeaderProps) {
  const { t } = useLanguage()
  return (
    <div className="text-center mb-8">
      <h1 className="text-2xl font-bold text-ink-50 mb-2">{t(titleKey)}</h1>
      <p className="text-ink-400 text-sm">{t(subtitleKey)}</p>
    </div>
  )
}
