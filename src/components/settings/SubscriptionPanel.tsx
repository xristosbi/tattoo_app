'use client'

import { useState } from 'react'
import { CreditCard, ExternalLink, Zap } from 'lucide-react'
import Card, { CardHeader, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { TierBadge, StatusBadge } from '@/components/ui/Badge'
import { formatDate, tierLabel } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'
import type { Subscription } from '@/types'

interface SubscriptionPanelProps {
  subscription: Subscription | null
  userEmail: string
}

export default function SubscriptionPanel({ subscription, userEmail }: SubscriptionPanelProps) {
  const [portalLoading, setPortalLoading] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState<'starter' | 'plus' | 'professional' | null>(null)
  const { t } = useLanguage()

  const tier = subscription?.tier ?? 'free'

  async function handlePortal() {
    setPortalLoading(true)
    const res = await fetch('/api/billing/portal', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
    setPortalLoading(false)
  }

  async function handleUpgrade(plan: 'starter' | 'plus' | 'professional') {
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
          <h2 className="font-semibold text-ink-100">{t('subscription_title')}</h2>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-ink-100">{tierLabel(tier)} {t('plan_label')}</span>
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
              {t('manage_billing')}
            </Button>
          )}
        </div>

        {subscription?.current_period_end && tier !== 'free' && (
          <p className="text-xs text-ink-500">
            {subscription.cancel_at_period_end
              ? `${t('cancels_on')} ${formatDate(subscription.current_period_end)}`
              : `${t('renews_on')} ${formatDate(subscription.current_period_end)}`}
          </p>
        )}

        {/* Upgrade options for free tier */}
        {tier === 'free' && (
          <div className="pt-2 border-t border-ink-600 space-y-2">
            <p className="text-xs text-ink-400 font-medium uppercase tracking-wider mb-3">
              {t('upgrade_section')}
            </p>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-ink-800 border border-ink-600 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-ink-100 text-sm">Starter</p>
                  <p className="text-forge-300 font-bold text-sm">€12/μήνα</p>
                  <p className="text-xs text-ink-500">20 {t('gens_per_month')}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleUpgrade('starter')}
                  loading={checkoutLoading === 'starter'}
                >
                  <Zap className="w-3.5 h-3.5" /> {t('upgrade_btn')}
                </Button>
              </div>
              <div className="bg-ink-800 border border-forge-300/30 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-ink-100 text-sm">Plus</p>
                  <p className="text-forge-300 font-bold text-sm">€29/μήνα</p>
                  <p className="text-xs text-ink-500">60 {t('gens_per_month')}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleUpgrade('plus')}
                  loading={checkoutLoading === 'plus'}
                >
                  <Zap className="w-3.5 h-3.5" /> {t('upgrade_btn')}
                </Button>
              </div>
              <div className="bg-ink-800 border border-forge-100/30 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-forge-100 text-sm">Professional</p>
                  <p className="text-forge-100 font-bold text-sm">€59/μήνα</p>
                  <p className="text-xs text-ink-500">{t('unlimited_desc')}</p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  className="border-forge-100/30 text-forge-100"
                  onClick={() => handleUpgrade('professional')}
                  loading={checkoutLoading === 'professional'}
                >
                  <Zap className="w-3.5 h-3.5" /> {t('upgrade_btn')}
                </Button>
              </div>
            </div>
          </div>
        )}

        {(tier === 'starter' || tier === 'plus') && (
          <div className="pt-2 border-t border-ink-600">
            <div className="bg-ink-800 border border-forge-100/30 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forge-100">{t('upgrade_to_professional')}</p>
                <p className="text-xs text-ink-500">{t('unlimited_desc')}</p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="border-forge-100/30 text-forge-100"
                onClick={() => handleUpgrade('professional')}
                loading={checkoutLoading === 'professional'}
              >
                €59/μήνα
              </Button>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}
