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
  generateFromImage: (file: File, notes?: string) => Promise<void>
  generateFromText: (prompt: string) => Promise<void>
  reset: () => void
}

const POLL_INTERVAL_MS = 3000
const MAX_POLL_ATTEMPTS = 60

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
        setError('Η δημιουργία έλαβε πολύ χρόνο. Παρακαλώ δοκίμασε ξανά.')
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
          setError(data.error ?? 'Η δημιουργία απέτυχε')
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

      try {
        const res = await fetch('/api/generate', { method: 'POST', body: formData })
        const data = await res.json()

        if (!res.ok) {
          setState('error')
          if (res.status === 429) {
            setError('quota_exceeded')
          } else {
            setError(data.error ?? 'Αποτυχία εκκίνησης δημιουργίας')
          }
          return
        }

        setGenerationId(data.generationId)

        // Synchronous: OpenAI returned the result immediately
        if (data.status === 'completed' && data.stencilUrl) {
          setStencilUrl(data.stencilUrl)
          setState('completed')
          return
        }

        // Fallback: start polling for async/legacy cases
        setState('processing')
        startPolling(data.generationId)
      } catch (err) {
        setState('error')
        setError(err instanceof Error ? err.message : 'Αποτυχία δημιουργίας')
      }
    },
    [startPolling]
  )

  const generateFromImage = useCallback(
    async (file: File, notes?: string) => {
      const formData = new FormData()
      formData.append('type', 'image_to_stencil')
      formData.append('file', file)
      if (notes?.trim()) formData.append('notes', notes.trim())
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
