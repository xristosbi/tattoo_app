'use client'

import { useEffect, useState } from 'react'
import Spinner from '@/components/ui/Spinner'

const IMAGE_STEPS = [
  'Uploading image…',
  'Detecting edges and lines…',
  'Extracting line art…',
  'Cleaning up stencil…',
  'Finalizing output…',
]

const TEXT_STEPS = [
  'Interpreting your concept…',
  'Generating illustration…',
  'Extracting line art…',
  'Converting to stencil…',
  'Finalizing output…',
]

interface GenerationProgressProps {
  type: 'image' | 'text'
}

export default function GenerationProgress({ type }: GenerationProgressProps) {
  const steps = type === 'image' ? IMAGE_STEPS : TEXT_STEPS
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
      <p className="text-ink-500 text-xs">This usually takes 20–45 seconds</p>

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
