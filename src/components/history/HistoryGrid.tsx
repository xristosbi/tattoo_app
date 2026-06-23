'use client'

import { Clock } from 'lucide-react'
import HistoryCard from './HistoryCard'
import type { GenerationWithUrl } from '@/types'

interface HistoryGridProps {
  generations: GenerationWithUrl[]
}

export default function HistoryGrid({ generations }: HistoryGridProps) {
  if (generations.length === 0) {
    return (
      <div className="text-center py-24 border border-dashed border-ink-600 rounded-xl">
        <div className="w-12 h-12 bg-ink-800 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Clock className="w-6 h-6 text-ink-600" />
        </div>
        <p className="text-ink-400 font-medium">No stencils yet</p>
        <p className="text-ink-600 text-sm mt-1">
          Your generated stencils will appear here
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {generations.map((gen) => (
        <HistoryCard key={gen.id} generation={gen} />
      ))}
    </div>
  )
}
