'use client'

import { useState } from 'react'
import { CreditCard, ExternalLink, Zap } from 'lucide-react'
import Card, { CardHeader, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { TierBadge, StatusBadge } from '@/components/ui/Badge'
import { formatDate, tierLabel } from '@/lib/utils'
import type { Subscription } from '@/types'

interface SubscriptionPanelProps {
  subscription: Subscription | null
  userEmail: string
}

export default function SubscriptionPanel({ subscription, userEmail }: SubscriptionPanelProps) {
  const [portalLoading, setPortalLoading] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState<'pro' | 'studio' | null>(null)

  const tier = subscription?.tier ?? 'free'

  async function handlePortal() {
    setPortalLoading(true)
    const res = await fetch('/api/billing/portal', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
    setPortalLoading(false)
  }

  async function handleUpgrade(plan: 'pro' | 'studio') {
    setCheckoutLoading(plan)
    const res = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    const { url } = await res.json()
    if (url) window.location.href = url
    setCheckoutLoading(null)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-ink-400" />
          <h2 className="font-semibold text-ink-100">Subscription</h2>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-ink-100">{tierLabel(tier)} plan</span>
              <TierBadge tier={tier} />
              {subscription?.status && <StatusBadge status={subscription.status} />}
            </div>
            <p className="text-sm text-ink-400">{userEmail}</p>
          </div>
          {tier !== 'free' && subscription?.stripe_subscription_id && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePortal}
              loading={portalLoading}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Manage billing
            </Button>
          )}
        </div>

        {subscription?.current_period_end && tier !== 'free' && (
          <p className="text-xs text-ink-500">
            {subscription.cancel_at_period_end
              ? `Cancels on ${formatDate(subscription.current_period_end)}`
              : `Renews on ${formatDate(subscription.current_period_end)}`}
          </p>
        )}

        {/* Upgrade options */}
        {tier === 'free' && (
          <div className="pt-2 border-t border-ink-600 space-y-2">
            <p className="text-xs text-ink-400 font-medium uppercase tracking-wider mb-3">
              Upgrade
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-ink-800 border border-ink-600 rounded-xl p-3">
                <p className="font-semibold text-ink-100 text-sm mb-0.5">Pro</p>
                <p className="text-forge-300 font-bold text-sm mb-1">€19/mo</p>
                <p className="text-xs text-ink-500 mb-3">100 gens/month</p>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => handleUpgrade('pro')}
                  loading={checkoutLoading === 'pro'}
                >
                  <Zap className="w-3.5 h-3.5" /> Upgrade
                </Button>
              </div>
              <div className="bg-ink-800 border border-forge-300/30 rounded-xl p-3">
                <p className="font-semibold text-ink-100 text-sm mb-0.5">Studio</p>
                <p className="text-forge-300 font-bold text-sm mb-1">€49/mo</p>
                <p className="text-xs text-ink-500 mb-3">Unlimited + team</p>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => handleUpgrade('studio')}
                  loading={checkoutLoading === 'studio'}
                >
                  <Zap className="w-3.5 h-3.5" /> Upgrade
                </Button>
              </div>
            </div>
          </div>
        )}

        {tier === 'pro' && (
          <div className="pt-2 border-t border-ink-600">
            <div className="bg-ink-800 border border-forge-300/30 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink-100">Upgrade to Studio</p>
                <p className="text-xs text-ink-500">Unlimited generations + 3 team members</p>
              </div>
              <Button
                size="sm"
                onClick={() => handleUpgrade('studio')}
                loading={checkoutLoading === 'studio'}
              >
                €49/mo
              </Button>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}
