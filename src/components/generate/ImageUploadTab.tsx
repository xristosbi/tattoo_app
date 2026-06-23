'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image } from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE_MB = 10

interface ImageUploadTabProps {
  onGenerate: (file: File) => Promise<void>
  disabled?: boolean
}

export default function ImageUploadTab({ onGenerate, disabled }: ImageUploadTabProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function validateAndSetFile(f: File) {
    setFileError(null)
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setFileError('Please upload a JPEG, PNG, WebP, or GIF image.')
      return
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setFileError(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`)
      return
    }
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const dropped = e.dataTransfer.files[0]
      if (dropped) validateAndSetFile(dropped)
    },
    []
  )

  function clearFile() {
    setFile(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setFileError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file || disabled) return
    await onGenerate(file)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!preview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
            'min-h-[200px] flex flex-col items-center justify-center gap-3',
            dragOver
              ? 'border-forge-300 bg-forge-300/5'
              : 'border-ink-600 hover:border-ink-500 bg-ink-900 hover:bg-ink-800'
          )}
        >
          <div className="w-12 h-12 bg-ink-700 rounded-xl flex items-center justify-center">
            <Upload className="w-6 h-6 text-ink-400" />
          </div>
          <div>
            <p className="text-sm text-ink-200 font-medium">
              Drop your image here
            </p>
            <p className="text-xs text-ink-400 mt-1">
              or click to browse · JPEG, PNG, WebP · Max {MAX_SIZE_MB}MB
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) validateAndSetFile(f)
            }}
          />
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-ink-600 bg-ink-900">
          <img
            src={preview}
            alt="Upload preview"
            className="w-full object-contain max-h-[300px]"
          />
          <button
            type="button"
            onClick={clearFile}
            className="absolute top-2 right-2 bg-ink-950/80 hover:bg-ink-900 border border-ink-600 rounded-lg p-1.5 text-ink-300 hover:text-ink-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-2 bg-ink-950/80 px-2 py-1 rounded text-xs text-ink-300 flex items-center gap-1.5">
            <Image className="w-3 h-3" />
            {file?.name}
          </div>
        </div>
      )}

      {fileError && (
        <p className="text-xs text-red-400">{fileError}</p>
      )}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={!file || disabled}
        loading={disabled}
      >
        {disabled ? 'Generating…' : 'Generate stencil'}
      </Button>
    </form>
  )
}
