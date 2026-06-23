'use client'

import { useState } from 'react'
import { Image, Type } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGeneration } from '@/hooks/useGeneration'
import ImageUploadTab from './ImageUploadTab'
import TextPromptTab from './TextPromptTab'
import GenerationProgress from './GenerationProgress'
import StencilResult from './StencilResult'
import UpgradeModal from './UpgradeModal'
import ProgressBar from '@/components/ui/ProgressBar'
import { ToastProvider } from '@/components/ui/Toast'
import type { QuotaInfo } from '@/types'

type Tab = 'image' | 'text'

interface GeneratePageClientProps {
  quotaInfo: {
    used: number
    limit: number
    tier: string
    periodEnd: string
  }
}

const tabs: { id: Tab; label: string; icon: typeof Image }[] = [
  { id: 'image', label: 'Image to Stencil', icon: Image },
  { id: 'text', label: 'Text to Stencil', icon: Type },
]

export default function GeneratePageClient({ quotaInfo }: GeneratePageClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>('image')
  const [showUpgrade, setShowUpgrade] = useState(false)
  const { state, stencilUrl, error, generateFromImage, generateFromText, reset } =
    useGeneration()

  const isActive = state === 'submitting' || state === 'processing'
  const isUnlimited = quotaInfo.limit === -1

  function handleError(err: string | null) {
    if (err === 'quota_exceeded') {
      setShowUpgrade(true)
    }
  }

  return (
    <ToastProvider>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink-50">Generate stencil</h1>
            <p className="text-ink-400 text-sm mt-1">
              Upload a photo or describe your tattoo concept
            </p>
          </div>
          <div className="text-right min-w-[160px]">
            <p className="text-xs text-ink-400 mb-1.5">
              {isUnlimited
                ? `${quotaInfo.used} generated this month`
                : `${quotaInfo.used} / ${quotaInfo.limit} this month`}
            </p>
            <ProgressBar value={quotaInfo.used} max={quotaInfo.limit} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Controls */}
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex gap-1 bg-ink-900 border border-ink-600 p-1 rounded-xl">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    if (!isActive) {
                      setActiveTab(id)
                      reset()
                    }
                  }}
                  disabled={isActive}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors',
                    activeTab === id
                      ? 'bg-ink-700 text-ink-50'
                      : 'text-ink-400 hover:text-ink-200 disabled:cursor-not-allowed'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{id === 'image' ? 'Image' : 'Text'}</span>
                </button>
              ))}
            </div>

            {/* Active tab */}
            {activeTab === 'image' ? (
              <ImageUploadTab
                onGenerate={generateFromImage}
                disabled={isActive}
              />
            ) : (
              <TextPromptTab
                onGenerate={generateFromText}
                disabled={isActive}
              />
            )}
          </div>

          {/* Right: Result/Progress */}
          <div>
            {state === 'idle' && (
              <div className="h-full min-h-[300px] lg:min-h-[400px] bg-ink-900 border border-ink-600 rounded-xl flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-ink-800 border border-ink-600 rounded-xl flex items-center justify-center mb-4">
                  <Image className="w-8 h-8 text-ink-600" />
                </div>
                <p className="text-ink-500 text-sm">
                  Your stencil will appear here
                </p>
              </div>
            )}

            {(state === 'submitting' || state === 'processing') && (
              <GenerationProgress type={activeTab} />
            )}

            {state === 'completed' && stencilUrl && (
              <StencilResult stencilUrl={stencilUrl} onReset={reset} />
            )}

            {state === 'error' && (
              <div className="h-full min-h-[300px] lg:min-h-[400px] bg-ink-900 border border-red-500/20 rounded-xl flex flex-col items-center justify-center text-center p-8">
                <p className="text-red-400 font-medium mb-2">Generation failed</p>
                <p className="text-ink-400 text-sm mb-6">
                  {error !== 'quota_exceeded'
                    ? (error ?? 'Something went wrong. Please try again.')
                    : 'You have used all your generations for this month.'}
                </p>
                <button
                  onClick={() => {
                    if (error === 'quota_exceeded') {
                      setShowUpgrade(true)
                    } else {
                      reset()
                    }
                  }}
                  className="text-sm text-forge-300 hover:text-forge-200"
                >
                  {error === 'quota_exceeded' ? 'Upgrade plan' : 'Try again'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        currentTier={quotaInfo.tier as 'free' | 'pro' | 'studio'}
      />
    </ToastProvider>
  )
}
