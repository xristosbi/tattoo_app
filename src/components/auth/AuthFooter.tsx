'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import type { TranslationKey } from '@/i18n/translations'

interface AuthFooterProps {
  textKey: TranslationKey
  linkKey: TranslationKey
  href: string
}

export default function AuthFooter({ textKey, linkKey, href }: AuthFooterProps) {
  const { t } = useLanguage()
  return (
    <p className="text-center text-sm text-ink-400 mt-6">
      {t(textKey)}{' '}
      <Link href={href} className="text-forge-300 hover:text-forge-200 font-medium">
        {t(linkKey)}
      </Link>
    </p>
  )
}
