'use client'

import { Download, RotateCcw, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'

interface StencilResultProps {
  stencilUrl: string
  onReset: () => void
}

export default function StencilResult({ stencilUrl, onReset }: StencilResultProps) {
  async function handleDownload() {
    const res = await fetch(stencilUrl)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `inkforge-stencil-${Date.now()}.png`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-ink-900 border border-ink-600 rounded-xl overflow-hidden animate-fade-in">
      {/* Success banner */}
      <div className="flex items-center gap-2 px-4 py-3 bg-green-500/10 border-b border-green-500/20">
        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
        <span className="text-sm text-green-400 font-medium">Stencil ready!</span>
      </div>

      {/* Preview */}
      <div className="bg-white">
        <img
          src={stencilUrl}
          alt="Generated stencil"
          className="w-full object-contain max-h-[400px]"
        />
      </div>

      {/* Actions */}
      <div className="p-4 flex gap-3">
        <Button onClick={handleDownload} className="flex-1" size="lg">
          <Download className="w-4 h-4" />
          Download PNG
        </Button>
        <Button onClick={onReset} variant="secondary" size="lg">
          <RotateCcw className="w-4 h-4" />
          New
        </Button>
      </div>
    </div>
  )
}
