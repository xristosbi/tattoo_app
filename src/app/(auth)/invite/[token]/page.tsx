import { createAdminClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Users } from 'lucide-react'
import AcceptInviteButton from '@/components/auth/AcceptInviteButton'

export const metadata = { title: 'Team Invite — Inkforge' }

export default async function InvitePage({
  params,
}: {
  params: { token: string }
}) {
  const supabase = createAdminClient()

  const { data: inviteRaw } = await supabase
    .from('team_members')
    .select('*')
    .eq('invite_token', params.token)
    .eq('status', 'pending')
    .single()

  const invite = inviteRaw as import('@/types').TeamMember | null

  if (!invite) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="card-surface p-8">
          <div className="w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-ink-50 mb-2">Invalid invite</h1>
          <p className="text-ink-400 text-sm mb-6">
            This invite link is invalid or has already been used.
          </p>
          <Link
            href="/"
            className="text-forge-300 hover:text-forge-200 text-sm font-medium"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    )
  }

  const { data: ownerProfileRaw } = await supabase
    .from('profiles')
    .select('email, full_name')
    .eq('id', invite.owner_id)
    .single()

  const ownerProfile = ownerProfileRaw as { email: string; full_name: string | null } | null
  const ownerDisplay = ownerProfile?.full_name || ownerProfile?.email || 'A Studio user'

  return (
    <div className="w-full max-w-md">
      <div className="card-surface p-8 text-center">
        <div className="w-12 h-12 bg-forge-300/10 border border-forge-300/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-6 h-6 text-forge-300" />
        </div>
        <h1 className="text-xl font-bold text-ink-50 mb-2">You&apos;re invited</h1>
        <p className="text-ink-400 text-sm mb-1">
          <span className="text-ink-200 font-medium">{ownerDisplay}</span> has invited you to join
          their Inkforge Studio team.
        </p>
        <p className="text-ink-500 text-xs mb-6">
          This invite was sent to{' '}
          <span className="text-ink-300">{invite.invite_email}</span>
        </p>

        <div className="space-y-3">
          <AcceptInviteButton token={params.token} email={invite.invite_email} />
          <p className="text-xs text-ink-500">
            Need an account first?{' '}
            <Link
              href={`/signup?next=/invite/${params.token}`}
              className="text-forge-300 hover:text-forge-200"
            >
              Sign up
            </Link>{' '}
            or{' '}
            <Link
              href={`/login?next=/invite/${params.token}`}
              className="text-forge-300 hover:text-forge-200"
            >
              log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
