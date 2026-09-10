'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Wand2, Clock, Settings, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { TierBadge } from '@/components/ui/Badge'
import UserMenu from './UserMenu'
import type { SubscriptionTier } from '@/types'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types'

interface DashboardNavProps {
  user: User
  profile: Profile | null
  tier: SubscriptionTier
}

const navLinks = [
  { href: '/generate', label: 'Generate', icon: Wand2 },
  { href: '/history', label: 'History', icon: Clock },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function DashboardNav({ user, profile, tier }: DashboardNavProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="border-b border-ink-600 bg-ink-950/90 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/generate" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-7 h-7 bg-forge-300 rounded-md flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L8.6 5.1L13 5.8L10 8.7L10.7 13L7 11L3.3 13L4 8.7L1 5.8L5.4 5.1L7 1Z" fill="#F0EDE8"/>
            </svg>
          </div>
          <span className="font-playfair font-bold text-lg text-ink-50 tracking-wide">INKFORGE</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors',
                pathname.startsWith(href)
                  ? 'bg-ink-700 text-ink-50'
                  : 'text-ink-300 hover:text-ink-100 hover:bg-ink-800'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
              {href === '/settings' && <TierBadge tier={tier} />}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <UserMenu user={user} profile={profile} tier={tier} />
          </div>
          <button
            className="md:hidden text-ink-300 hover:text-ink-100 p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-ink-600 bg-ink-900 px-4 py-4 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                pathname.startsWith(href)
                  ? 'bg-ink-700 text-ink-50'
                  : 'text-ink-300 hover:text-ink-100 hover:bg-ink-800'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
              {href === '/settings' && <TierBadge tier={tier} />}
            </Link>
          ))}
          <div className="pt-2 border-t border-ink-600 mt-2">
            <UserMenu user={user} profile={profile} tier={tier} mobile />
          </div>
        </div>
      )}
    </nav>
  )
}
