'use client'

import { useState } from 'react'
import { Download, Image, Type } from 'lucide-react'
import { formatRelativeDate, truncate } from '@/lib/utils'
import type { GenerationWithUrl } from '@/types'

interface HistoryCardProps {
  generation: GenerationWithUrl
}

export default function HistoryCard({ generation }: HistoryCardProps) {
  const [downloading, setDownloading] = useState(false)

  async function handleDownload(e: React.MouseEvent) {
    e.stopPropagation()
    if (!generation.stencilUrl || downloading) return
    setDownloading(true)
    const res = await fetch(generation.stencilUrl)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `inkforge-stencil-${generation.id.slice(0, 8)}.png`
    a.click()
    URL.revokeObjectURL(url)
    setDownloading(false)
  }

  const isImage = generation.type === 'image_to_stencil'

  return (
    <div className="group relative bg-ink-900 border border-ink-600 rounded-xl overflow-hidden hover:border-ink-500 transition-colors">
      {/* Preview */}
      <div className="aspect-square bg-white relative">
        {generation.stencilUrl ? (
          <img
            src={generation.stencilUrl}
            alt={generation.prompt ?? 'Stencil'}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-ink-800">
            {isImage ? (
              <Image className="w-8 h-8 text-ink-600" />
            ) : (
              <Type className="w-8 h-8 text-ink-600" />
            )}
          </div>
        )}

        {/* Hover overlay */}
        {generation.stencilUrl && (
          <div className="absolute inset-0 bg-ink-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="bg-forge-300 hover:bg-forge-200 text-ink-950 p-2.5 rounded-xl font-semibold transition-colors shadow-lg"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-ink-500" />
          <span className="text-xs text-ink-500 uppercase tracking-wider font-medium">
            {isImage ? 'Image' : 'Text'}
          </span>
        </div>
        {generation.prompt && (
          <p className="text-xs text-ink-400 leading-relaxed">
            {truncate(generation.prompt, 60)}
          </p>
        )}
        <p className="text-xs text-ink-600 mt-1">{formatRelativeDate(generation.created_at)}</p>
      </div>
    </div>
  )
}
