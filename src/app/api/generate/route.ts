import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { checkQuota } from '@/lib/quota'
import { createImageToStencilPrediction } from '@/lib/replicate/image-to-stencil'
import { createTextToImagePrediction } from '@/lib/replicate/text-to-stencil'

export const maxDuration = 60

export async function POST(request: Request) {
  try {
    console.log('[generate] POST started')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.log('[generate] user:', user.id)

    const adminSupabase = createAdminClient()

    const { data: membership } = await adminSupabase
      .from('team_members')
      .select('owner_id')
      .eq('member_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    const quotaOwnerId = membership?.owner_id ?? user.id

    const quota = await checkQuota(adminSupabase, quotaOwnerId)
    console.log('[generate] quota:', JSON.stringify(quota))

    if (!quota.allowed) {
      return NextResponse.json(
        { error: 'quota_exceeded', tier: quota.tier, limit: quota.limit, used: quota.used },
        { status: 429 }
      )
    }

    const formData = await request.formData()
    const type = formData.get('type') as string | null
    const prompt = formData.get('prompt') as string | null
    console.log('[generate] type:', type, 'prompt:', prompt)

    if (!type || !['image_to_stencil', 'text_to_stencil'].includes(type)) {
      return NextResponse.json({ error: 'Invalid generation type' }, { status: 400 })
    }
    if (type === 'text_to_stencil' && (!prompt || prompt.trim().length < 3)) {
      return NextResponse.json({ error: 'Prompt too short' }, { status: 400 })
    }

    const { data: generation, error: genError } = await adminSupabase
      .from('generations')
      .insert({
        user_id: user.id,
        quota_owner_id: quotaOwnerId,
        type: type as 'image_to_stencil' | 'text_to_stencil',
        status: 'pending',
        prompt: prompt ?? null,
        metadata: { pipeline_step: type === 'text_to_stencil' ? 'step1' : 'single' },
      })
      .select()
      .single()

    if (genError || !generation) {
      console.error('[generate] DB insert error:', genError?.message)
      return NextResponse.json({ error: `DB error: ${genError?.message}` }, { status: 500 })
    }
    console.log('[generate] generation row created:', generation.id)

    console.log('[generate] calling Replicate...')
    const prediction = type === 'image_to_stencil'
      ? await createImageToStencilPrediction('')
      : await createTextToImagePrediction(prompt!)

    console.log('[generate] prediction created:', prediction.id, prediction.status)

    await adminSupabase
      .from('generations')
      .update({
        status: 'processing',
        replicate_id: prediction.id,
        metadata: { pipeline_step: type === 'text_to_stencil' ? 'step1' : 'single', replicate_id: prediction.id },
      })
      .eq('id', generation.id)

    return NextResponse.json(
      { generationId: generation.id, status: 'processing' },
      { status: 202 }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack : undefined
    console.error('[generate] UNHANDLED ERROR:', message, '\n', stack)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
