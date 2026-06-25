import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { checkQuota } from '@/lib/quota'
import { uploadInput, getInputSignedUrl } from '@/lib/storage'
import { createImageToStencilPrediction } from '@/lib/replicate/image-to-stencil'
import { createTextToImagePrediction } from '@/lib/replicate/text-to-stencil'

export const maxDuration = 60

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminSupabase = createAdminClient()

    const { data: membership } = await adminSupabase
      .from('team_members')
      .select('owner_id')
      .eq('member_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    const quotaOwnerId = membership?.owner_id ?? user.id

    const quota = await checkQuota(adminSupabase, quotaOwnerId)
    if (!quota.allowed) {
      return NextResponse.json(
        { error: 'quota_exceeded', tier: quota.tier, limit: quota.limit, used: quota.used },
        { status: 429 }
      )
    }

    const formData = await request.formData()
    const type = formData.get('type') as string | null
    const prompt = formData.get('prompt') as string | null
    const file = formData.get('file') as File | null

    if (!type || !['image_to_stencil', 'text_to_stencil'].includes(type)) {
      return NextResponse.json({ error: 'Invalid generation type' }, { status: 400 })
    }
    if (type === 'image_to_stencil' && !file) {
      return NextResponse.json({ error: 'File required for image to stencil' }, { status: 400 })
    }
    if (type === 'text_to_stencil' && (!prompt || prompt.trim().length < 3)) {
      return NextResponse.json({ error: 'Prompt too short' }, { status: 400 })
    }
    if (file && file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 413 })
    }

    // Upload input image
    let inputStoragePath: string | null = null
    if (type === 'image_to_stencil' && file) {
      inputStoragePath = await uploadInput(adminSupabase, user.id, file)
    }

    const { data: generation, error: genError } = await adminSupabase
      .from('generations')
      .insert({
        user_id: user.id,
        quota_owner_id: quotaOwnerId,
        type: type as 'image_to_stencil' | 'text_to_stencil',
        status: 'pending',
        prompt: prompt ?? null,
        input_storage_path: inputStoragePath,
        metadata: { pipeline_step: type === 'text_to_stencil' ? 'step1' : 'single' },
      })
      .select()
      .single()

    if (genError || !generation) {
      console.error('[generate] DB insert error:', genError?.message)
      return NextResponse.json({ error: `DB error: ${genError?.message}` }, { status: 500 })
    }

    let prediction
    if (type === 'image_to_stencil') {
      const imageUrl = await getInputSignedUrl(adminSupabase, inputStoragePath!, 3600)
      prediction = await createImageToStencilPrediction(imageUrl)
    } else {
      prediction = await createTextToImagePrediction(prompt!)
    }

    await adminSupabase
      .from('generations')
      .update({
        status: 'processing',
        replicate_id: prediction.id,
        metadata: {
          pipeline_step: type === 'text_to_stencil' ? 'step1' : 'single',
          replicate_id: prediction.id,
        },
      })
      .eq('id', generation.id)

    return NextResponse.json(
      { generationId: generation.id, status: 'processing' },
      { status: 202 }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[generate] error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
