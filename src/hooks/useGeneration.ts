'use client'

import { useState, useRef, useCallback } from 'react'
import type { GenerationState } from '@/types'

interface GenerationResult {
  generationId: string
  status: 'processing' | 'completed' | 'failed'
  stencilUrl?: string
  error?: string
}

interface UseGenerationReturn {
  state: GenerationState
  stencilUrl: string | null
  error: string | null
  generationId: string | null
  generateFromImage: (file: File) => Promise<void>
  generateFromText: (prompt: string) => Promise<void>
  reset: () => void
}

const POLL_INTERVAL_MS = 3000
const MAX_POLL_ATTEMPTS = 100 // ~5 minutes

export function useGeneration(): UseGenerationReturn {
  const [state, setState] = useState<GenerationState>('idle')
  const [stencilUrl, setStencilUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [generationId, setGenerationId] = useState<string | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pollCountRef = useRef(0)

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
    pollCountRef.current = 0
  }

  function reset() {
    stopPolling()
    setState('idle')
    setStencilUrl(null)
    setError(null)
    setGenerationId(null)
  }

  const startPolling = useCallback((genId: string) => {
    stopPolling()
    pollCountRef.current = 0

    pollRef.current = setInterval(async () => {
      pollCountRef.current++

      if (pollCountRef.current > MAX_POLL_ATTEMPTS) {
        stopPolling()
        setState('error')
        setError('Generation timed out. Please try again.')
        return
      }

      try {
        const res = await fetch(`/api/generate/${genId}/poll`)
        const data: GenerationResult = await res.json()

        if (data.status === 'completed' && data.stencilUrl) {
          stopPolling()
          setStencilUrl(data.stencilUrl)
          setState('completed')
        } else if (data.status === 'failed') {
          stopPolling()
          setState('error')
          setError(data.error ?? 'Generation failed')
        }
      } catch {
        // Network error — keep polling
      }
    }, POLL_INTERVAL_MS)
  }, [])

  const submitGeneration = useCallback(
    async (formData: FormData) => {
      setState('submitting')
      setError(null)
      setStencilUrl(null)
      setGenerationId(null)

      const res = await fetch('/api/generate', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setState('error')
        if (res.status === 429) {
          setError('quota_exceeded')
        } else {
          setError(data.error ?? 'Failed to start generation')
        }
        return
      }

      // Image-to-stencil is synchronous — returns 200 with stencilUrl directly
      if (res.status === 200 && data.stencilUrl) {
        setGenerationId(data.generationId ?? null)
        setStencilUrl(data.stencilUrl)
        setState('completed')
        return
      }

      // Text-to-stencil is async — poll for result
      setGenerationId(data.generationId)
      setState('processing')
      startPolling(data.generationId)
    },
    [startPolling]
  )

  const generateFromImage = useCallback(
    async (file: File) => {
      const formData = new FormData()
      formData.append('type', 'image_to_stencil')
      formData.append('file', file)
      await submitGeneration(formData)
    },
    [submitGeneration]
  )

  const generateFromText = useCallback(
    async (prompt: string) => {
      const formData = new FormData()
      formData.append('type', 'text_to_stencil')
      formData.append('prompt', prompt)
      await submitGeneration(formData)
    },
    [submitGeneration]
  )

  return {
    state,
    stencilUrl,
    error,
    generationId,
    generateFromImage,
    generateFromText,
    reset,
  }
}
