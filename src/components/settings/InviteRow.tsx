'use client'

import { useState } from 'react'
import { UserX, Clock, CheckCircle } from 'lucide-react'
import { getInitials, formatRelativeDate } from '@/lib/utils'
import type { TeamMemberWithProfile } from '@/types'

interface InviteRowProps {
  member: TeamMemberWithProfile
  onRevoke: () => void
}

export default function InviteRow({ member, onRevoke }: InviteRowProps) {
  const [confirming, setConfirming] = useState(false)

  const displayName =
    member.profile?.full_name ?? member.invite_email
  const initials = getInitials(member.profile?.full_name, member.invite_email)

  const statusIcon =
    member.status === 'active' ? (
      <CheckCircle className="w-3.5 h-3.5 text-green-400" />
    ) : (
      <Clock className="w-3.5 h-3.5 text-yellow-400" />
    )

  const statusLabel = member.status === 'active' ? 'Active' : 'Pending'

  if (member.status === 'revoked') return null

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-8 h-8 rounded-full bg-ink-700 border border-ink-600 flex items-center justify-center text-xs font-medium text-ink-300">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-ink-100 truncate">{displayName}</p>
        <p className="text-xs text-ink-500 truncate">{member.invite_email}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-xs text-ink-400">
          {statusIcon}
          {statusLabel}
        </div>
        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            className="text-ink-500 hover:text-red-400 transition-colors p-1 rounded"
            title="Revoke access"
          >
            <UserX className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="flex gap-1">
            <button
              onClick={() => { onRevoke(); setConfirming(false) }}
              className="text-xs text-red-400 hover:text-red-300 px-2 py-0.5 bg-red-500/10 rounded"
            >
              Revoke
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="text-xs text-ink-400 px-2 py-0.5"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
