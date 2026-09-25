'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-1 bg-ink-900 border border-ink-700 rounded-lg p-0.5">
      <button
        onClick={() => setLanguage('el')}
        title="Ελληνικά"
        className={`px-2 py-1 rounded text-sm transition-colors ${
          language === 'el'
            ? 'bg-ink-700 text-ink-50'
            : 'text-ink-500 hover:text-ink-300'
        }`}
      >
        🇬🇷
      </button>
      <button
        onClick={() => setLanguage('en')}
        title="English"
        className={`px-2 py-1 rounded text-sm transition-colors ${
          language === 'en'
            ? 'bg-ink-700 text-ink-50'
            : 'text-ink-500 hover:text-ink-300'
        }`}
      >
        🇬🇧
      </button>
    </div>
  )
}
