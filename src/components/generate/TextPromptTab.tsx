'use client'

import { useState } from 'react'
import { Wand2 } from 'lucide-react'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/contexts/LanguageContext'

interface TextPromptTabProps {
  onGenerate: (prompt: string) => Promise<void>
  disabled?: boolean
}

export default function TextPromptTab({ onGenerate, disabled }: TextPromptTabProps) {
  const [prompt, setPrompt] = useState('')
  const { t } = useLanguage()

  const examples = [
    t('example_1'),
    t('example_2'),
    t('example_3'),
    t('example_4'),
  ]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!prompt.trim() || disabled) return
    await onGenerate(prompt.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        label={t('prompt_label')}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={t('prompt_placeholder')}
        rows={4}
        maxLength={500}
        disabled={disabled}
      />

      <div>
        <p className="text-xs text-ink-500 mb-2 uppercase tracking-wider font-medium">
          {t('try_example')}
        </p>
        <div className="flex flex-wrap gap-2">
          {examples.map((ex) => (
            <button
              key={ex}
              type="button"
              disabled={disabled}
              onClick={() => setPrompt(ex)}
              className="text-xs px-2.5 py-1 bg-ink-800 border border-ink-600 hover:border-ink-500 text-ink-300 hover:text-ink-100 rounded-lg transition-colors disabled:opacity-50"
            >
              {ex.length > 35 ? ex.slice(0, 35) + '…' : ex}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-ink-500">{prompt.length}/500</span>
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={prompt.trim().length < 3 || disabled}
        loading={disabled}
      >
        <Wand2 className="w-4 h-4" />
        {disabled ? t('generating') : t('generate_btn')}
      </Button>
    </form>
  )
}
