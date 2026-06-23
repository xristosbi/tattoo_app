'use client'

import { useState } from 'react'
import { Users, Plus, Copy, Check } from 'lucide-react'
import Card, { CardHeader, CardBody } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import InviteRow from './InviteRow'
import type { TeamMemberWithProfile } from '@/types'

interface TeamPanelProps {
  teamMembers: TeamMemberWithProfile[]
}

export default function TeamPanel({ teamMembers }: TeamPanelProps) {
  const [showInvite, setShowInvite] = useState(false)
  const [email, setEmail] = useState('')
  const [inviteUrl, setInviteUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [members, setMembers] = useState(teamMembers)

  const activePending = members.filter((m) => m.status !== 'revoked')
  const canInvite = activePending.length < 2

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await fetch('/api/team/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.message ?? data.error ?? 'Failed to create invite')
      setLoading(false)
      return
    }
    setInviteUrl(data.inviteUrl)
    setLoading(false)
  }

  async function copyInviteUrl() {
    if (!inviteUrl) return
    await navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function closeModal() {
    setShowInvite(false)
    setEmail('')
    setInviteUrl(null)
    setError(null)
  }

  async function handleRevoke(memberId: string) {
    await fetch(`/api/team/${memberId}/revoke`, { method: 'PUT' })
    // memberId here is the team_members row UUID used as the [id] segment
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, status: 'revoked' as const } : m))
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-ink-400" />
              <h2 className="font-semibold text-ink-100">Team members</h2>
              <span className="text-xs text-ink-500">
                {activePending.length + 1}/3
              </span>
            </div>
            {canInvite && (
              <Button size="sm" variant="secondary" onClick={() => setShowInvite(true)}>
                <Plus className="w-3.5 h-3.5" />
                Invite
              </Button>
            )}
          </div>
        </CardHeader>
        <CardBody className="space-y-2">
          {/* Owner (you) */}
          <div className="flex items-center gap-3 py-2">
            <div className="w-8 h-8 rounded-full bg-forge-300/20 border border-forge-300/30 flex items-center justify-center text-xs font-bold text-forge-300">
              YOU
            </div>
            <div className="flex-1">
              <p className="text-sm text-ink-100">You (owner)</p>
            </div>
            <span className="text-xs text-ink-500 bg-ink-800 px-2 py-0.5 rounded">Owner</span>
          </div>

          {members.map((member) => (
            <InviteRow
              key={member.id}
              member={member}
              onRevoke={() => handleRevoke(member.id)}
            />
          ))}

          {activePending.length === 0 && (
            <p className="text-xs text-ink-500 text-center py-4">
              No team members yet. Invite up to 2 people to your studio.
            </p>
          )}

          {!canInvite && (
            <p className="text-xs text-ink-500 text-center pt-2">
              Team is full (3/3). Revoke a member to invite someone new.
            </p>
          )}
        </CardBody>
      </Card>

      <Modal
        open={showInvite}
        onClose={closeModal}
        title={inviteUrl ? 'Share invite link' : 'Invite team member'}
      >
        {!inviteUrl ? (
          <form onSubmit={handleInvite} className="space-y-4">
            <p className="text-sm text-ink-400">
              Enter the email address of the person you want to invite. They&apos;ll need to
              sign up or log in using this email.
            </p>
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teammate@example.com"
              required
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <Button type="submit" loading={loading} className="w-full">
              Create invite link
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-ink-400">
              Share this link with your team member. The link can only be accepted by{' '}
              <span className="text-ink-200">{email}</span>.
            </p>
            <div className="flex gap-2">
              <div className="flex-1 bg-ink-800 border border-ink-600 rounded-lg px-3 py-2 text-xs text-ink-300 truncate font-mono">
                {inviteUrl}
              </div>
              <Button variant="secondary" size="sm" onClick={copyInviteUrl}>
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <Button variant="secondary" className="w-full" onClick={closeModal}>
              Done
            </Button>
          </div>
        )}
      </Modal>
    </>
  )
}
