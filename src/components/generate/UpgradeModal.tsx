'use client'

import { useState } from 'react'
import { Zap } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import type { SubscriptionTier } from '@/types'

interface UpgradeModalProps {
  open: boolean
  onClose: () => void
  currentTier: SubscriptionTier
}

export default function UpgradeModal({ open, onClose, currentTier }: UpgradeModalProps) {
  const [loading, setLoading] = useState<'starter' | 'plus' | 'professional' | null>(null)

  async function handleUpgrade(plan: 'starter' | 'plus' | 'professional') {
    setLoading(plan)
    const res = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    const { url } = await res.json()
    if (url) window.location.href = url
    setLoading(null)
  }

  return (
    <Modal open={open} onClose={onClose} title="Αναβάθμισε το πλάνο σου">
      <div className="space-y-4">
        <p className="text-sm text-ink-400">
          Εξαντλήσατε τις δημιουργίες αυτού του μήνα. Αναβαθμίστε για να συνεχίσετε.
        </p>

        <div className="space-y-3">
          {(currentTier === 'free' || currentTier === 'starter') && (
            <div className="border border-forge-300/40 bg-forge-300/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-ink-100">Starter</span>
                <span className="text-forge-300 font-bold">€12/μήνα</span>
              </div>
              <p className="text-xs text-ink-400 mb-3">20 δημιουργίες/μήνα</p>
              <Button
                className="w-full"
                loading={loading === 'starter'}
                onClick={() => handleUpgrade('starter')}
              >
                <Zap className="w-4 h-4" />
                Αναβάθμιση σε Starter
              </Button>
            </div>
          )}

          {currentTier !== 'professional' && (
            <div className="border border-ink-600 bg-ink-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-ink-100">Plus</span>
                <span className="text-forge-300 font-bold">€29/μήνα</span>
              </div>
              <p className="text-xs text-ink-400 mb-3">60 δημιουργίες/μήνα</p>
              <Button
                variant={currentTier === 'free' || currentTier === 'starter' ? 'secondary' : 'primary'}
                className="w-full"
                loading={loading === 'plus'}
                onClick={() => handleUpgrade('plus')}
              >
                Αναβάθμιση σε Plus
              </Button>
            </div>
          )}

          <div className="border border-forge-100/30 bg-forge-100/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-forge-100">Professional</span>
              <span className="text-forge-100 font-bold">€59/μήνα</span>
            </div>
            <p className="text-xs text-ink-400 mb-3">Απεριόριστες δημιουργίες</p>
            <Button
              variant="secondary"
              className="w-full border-forge-100/30 text-forge-100 hover:bg-forge-100/10"
              loading={loading === 'professional'}
              onClick={() => handleUpgrade('professional')}
            >
              Αναβάθμιση σε Professional
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
