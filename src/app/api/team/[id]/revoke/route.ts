import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

// [id] = team_members row UUID
export async function PUT(
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

  const { error } = await adminSupabase
    .from('team_members')
    .update({ status: 'revoked' })
    .eq('id', params.id)
    .eq('owner_id', user.id)

  if (error) {
    return NextResponse.json({ error: 'Failed to revoke member' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
