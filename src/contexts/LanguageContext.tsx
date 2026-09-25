'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { translations, type Language, type TranslationKey } from '@/i18n/translations'

const LanguageContext = createContext<{
  language: Language
  setLanguage: (l: Language) => void
  t: (key: TranslationKey) => string
}>({
  language: 'el',
  setLanguage: () => {},
  t: (k) => String(k),
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('el')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('inkforge_lang') as Language
      if (saved === 'en' || saved === 'el') setLanguageState(saved)
    } catch {}
  }, [])

  function setLanguage(l: Language) {
    setLanguageState(l)
    try {
      localStorage.setItem('inkforge_lang', l)
    } catch {}
  }

  function t(key: TranslationKey): string {
    return (
      (translations[language] as Record<string, string>)[key] ??
      (translations.en as Record<string, string>)[key] ??
      key
    )
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
