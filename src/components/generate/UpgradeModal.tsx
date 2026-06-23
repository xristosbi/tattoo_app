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
  const [loading, setLoading] = useState<'pro' | 'studio' | null>(null)

  async function handleUpgrade(plan: 'pro' | 'studio') {
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
    <Modal open={open} onClose={onClose} title="Upgrade your plan">
      <div className="space-y-4">
        <p className="text-sm text-ink-400">
          You&apos;ve used all your generations for this month. Upgrade to keep creating stencils.
        </p>

        <div className="space-y-3">
          {currentTier === 'free' && (
            <div className="border border-forge-300/40 bg-forge-300/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-ink-100">Pro</span>
                <span className="text-forge-300 font-bold">€19/mo</span>
              </div>
              <p className="text-xs text-ink-400 mb-3">100 generations/month</p>
              <Button
                className="w-full"
                loading={loading === 'pro'}
                onClick={() => handleUpgrade('pro')}
              >
                <Zap className="w-4 h-4" />
                Upgrade to Pro
              </Button>
            </div>
          )}

          <div className="border border-ink-600 bg-ink-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-ink-100">Studio</span>
              <span className="text-forge-300 font-bold">€49/mo</span>
            </div>
            <p className="text-xs text-ink-400 mb-3">
              Unlimited generations + up to 3 team members
            </p>
            <Button
              variant={currentTier === 'free' ? 'secondary' : 'primary'}
              className="w-full"
              loading={loading === 'studio'}
              onClick={() => handleUpgrade('studio')}
            >
              Upgrade to Studio
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
