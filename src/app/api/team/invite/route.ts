import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { APP_URL } from '@/lib/utils'

export async function POST(request: Request) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const adminSupabase = createAdminClient()

  // Verify studio tier
  const { data: sub } = await adminSupabase
    .from('subscriptions')
    .select('tier')
    .eq('user_id', user.id)
    .single()

  if (sub?.tier !== 'studio') {
    return NextResponse.json(
      { error: 'Studio plan required to invite team members' },
      { status: 403 }
    )
  }

  // Count existing active/pending members
  const { count } = await adminSupabase
    .from('team_members')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', user.id)
    .in('status', ['active', 'pending'])

  if ((count ?? 0) >= 2) {
    return NextResponse.json(
      { error: 'max_team_size_reached', message: 'You can add at most 2 additional members' },
      { status: 400 }
    )
  }

  const { email } = (await request.json()) as { email?: string }

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }

  // Don't invite yourself
  if (email.toLowerCase() === user.email?.toLowerCase()) {
    return NextResponse.json({ error: 'Cannot invite yourself' }, { status: 400 })
  }

  const { data: invite, error } = await adminSupabase
    .from('team_members')
    .insert({
      owner_id: user.id,
      invite_email: email.toLowerCase(),
      status: 'pending',
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'This email has already been invited' },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Failed to create invite' }, { status: 500 })
  }

  const inviteUrl = `${APP_URL}/invite/${invite.invite_token}`
  return NextResponse.json({ inviteUrl, token: invite.invite_token })
}
