'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, CreditCard, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getInitials } from '@/lib/utils'
import type { User } from '@supabase/supabase-js'
import type { Profile, SubscriptionTier } from '@/types'

interface UserMenuProps {
  user: User
  profile: Profile | null
  tier: SubscriptionTier
  mobile?: boolean
}

export default function UserMenu({ user, profile, mobile }: UserMenuProps) {
  const router = useRouter()
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const initials = getInitials(profile?.full_name, user.email ?? '')
  const displayName = profile?.full_name || user.email || ''

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  async function handleBillingPortal() {
    setPortalLoading(true)
    const res = await fetch('/api/billing/portal', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
    setPortalLoading(false)
  }

  if (mobile) {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-3 px-3 py-2 text-sm text-ink-300">
          <div className="w-7 h-7 rounded-full bg-forge-300/20 border border-forge-300/30 flex items-center justify-center text-xs font-bold text-forge-300">
            {initials}
          </div>
          <span className="truncate">{displayName}</span>
        </div>
        <button
          onClick={handleBillingPortal}
          disabled={portalLoading}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-ink-300 hover:text-ink-100 hover:bg-ink-800 rounded-lg transition-colors"
        >
          <CreditCard className="w-4 h-4" />
          Billing portal
        </button>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    )
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-ink-300 hover:text-ink-100 transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-forge-300/20 border border-forge-300/30 flex items-center justify-center text-xs font-bold text-forge-300">
          {initials}
        </div>
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-ink-900 border border-ink-600 rounded-xl shadow-xl py-1.5 z-50">
          <div className="px-3 py-2 border-b border-ink-600 mb-1">
            <p className="text-xs font-medium text-ink-200 truncate">{displayName}</p>
            <p className="text-xs text-ink-500 truncate">{user.email}</p>
          </div>
          <button
            onClick={() => { setOpen(false); handleBillingPortal() }}
            disabled={portalLoading}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-ink-300 hover:text-ink-100 hover:bg-ink-700 transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            Billing portal
          </button>
          <div className="border-t border-ink-600 my-1" />
          <button
            onClick={() => { setOpen(false); handleSignOut() }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
