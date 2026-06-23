import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

// [id] = invite token
export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const adminSupabase = createAdminClient()

  const { data: invite } = await adminSupabase
    .from('team_members')
    .select('*')
    .eq('invite_token', params.id)
    .eq('status', 'pending')
    .single()

  if (!invite) {
    return NextResponse.json(
      { error: 'Invalid or expired invite' },
      { status: 404 }
    )
  }

  if (invite.invite_email.toLowerCase() !== user.email?.toLowerCase()) {
    return NextResponse.json(
      {
        error: 'email_mismatch',
        message: `This invite was sent to ${invite.invite_email}. Please log in with that account.`,
      },
      { status: 403 }
    )
  }

  await adminSupabase
    .from('team_members')
    .update({
      status: 'active',
      member_id: user.id,
      accepted_at: new Date().toISOString(),
    })
    .eq('id', invite.id)

  return NextResponse.json({ success: true })
}
