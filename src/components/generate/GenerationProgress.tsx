'use client'

import { useEffect, useState } from 'react'
import Spinner from '@/components/ui/Spinner'
import { useLanguage } from '@/contexts/LanguageContext'

interface GenerationProgressProps {
  type: 'image' | 'text'
}

export default function GenerationProgress({ type }: GenerationProgressProps) {
  const { t } = useLanguage()

  const imageSteps = [
    t('progress_img_1'),
    t('progress_img_2'),
    t('progress_img_3'),
    t('progress_img_4'),
    t('progress_img_5'),
  ]
  const textSteps = [
    t('progress_txt_1'),
    t('progress_txt_2'),
    t('progress_txt_3'),
    t('progress_txt_4'),
    t('progress_txt_5'),
  ]

  const steps = type === 'image' ? imageSteps : textSteps
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    setStepIndex(0)
    const interval = setInterval(() => {
      setStepIndex((i) => (i < steps.length - 1 ? i + 1 : i))
    }, 6000)
    return () => clearInterval(interval)
  }, [steps.length])

  return (
    <div className="h-full min-h-[300px] lg:min-h-[400px] bg-ink-900 border border-ink-600 rounded-xl flex flex-col items-center justify-center text-center p-8">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border-2 border-ink-700 flex items-center justify-center">
          <Spinner size="md" />
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-forge-300/20 animate-ping" />
      </div>

      <p className="text-ink-200 font-medium mb-2">{steps[stepIndex]}</p>
      <p className="text-ink-500 text-xs">{t('progress_eta')}</p>

      <div className="flex gap-1.5 mt-6">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              i <= stepIndex ? 'bg-forge-300' : 'bg-ink-700'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
