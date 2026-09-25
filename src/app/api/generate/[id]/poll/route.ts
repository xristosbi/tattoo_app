import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { getStencilSignedUrl } from '@/lib/storage'

export const maxDuration = 30

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminSupabase = createAdminClient()

  const { data: generation } = await adminSupabase
    .from('generations')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!generation) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (generation.status === 'completed' && generation.output_storage_path) {
    const stencilUrl = await getStencilSignedUrl(adminSupabase, generation.output_storage_path)
    return NextResponse.json({ status: 'completed', stencilUrl })
  }

  if (generation.status === 'failed') {
    return NextResponse.json({
      status: 'failed',
      error: generation.error_message ?? 'Generation failed',
    })
  }

  return NextResponse.json({ status: 'processing' })
}
