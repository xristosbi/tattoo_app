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
    console.log('[generate] POST started')

    const supabase = createClient()
    console.log('[generate] supabase client created')

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log('[generate] auth result:', { userId: user?.id, authError: authError?.message })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminSupabase = createAdminClient()
    console.log('[generate] admin client created')

    const { data: membership } = await adminSupabase
      .from('team_members')
      .select('owner_id')
      .eq('member_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    const quotaOwnerId = membership?.owner_id ?? user.id
    console.log('[generate] quotaOwnerId:', quotaOwnerId)

    const quota = await checkQuota(adminSupabase, quotaOwnerId)
    console.log('[generate] quota:', quota)

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
    console.log('[generate] formData:', { type, prompt, fileName: file?.name, fileSize: file?.size })

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

    let inputStoragePath: string | null = null
    if (type === 'image_to_stencil' && file) {
      console.log('[generate] uploading input file...')
      inputStoragePath = await uploadInput(adminSupabase, user.id, file)
      console.log('[generate] uploaded to:', inputStoragePath)
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
        metadata: type === 'text_to_stencil'
          ? { pipeline_step: 'step1' }
          : { pipeline_step: 'single' },
      })
      .select()
      .single()

    console.log('[generate] insert result:', { generationId: generation?.id, genError: genError?.message })

    if (genError || !generation) {
      return NextResponse.json({ error: `Failed to create generation: ${genError?.message}` }, { status: 500 })
    }

    console.log('[generate] starting Replicate prediction, type:', type)
    let prediction
    if (type === 'image_to_stencil') {
      const imageUrl = await getInputSignedUrl(adminSupabase, inputStoragePath!, 3600)
      console.log('[generate] got signed URL, calling controlnet-scribble')
      prediction = await createImageToStencilPrediction(imageUrl)
    } else {
      console.log('[generate] calling flux-schnell')
      prediction = await createTextToImagePrediction(prompt!)
    }

    console.log('[generate] prediction created:', { id: prediction.id, status: prediction.status })

    await adminSupabase
      .from('generations')
      .update({
        status: 'processing',
        replicate_id: prediction.id,
        metadata: type === 'text_to_stencil'
          ? { pipeline_step: 'step1', step1_replicate_id: prediction.id }
          : { pipeline_step: 'single', replicate_id: prediction.id },
      })
      .eq('id', generation.id)

    return NextResponse.json(
      { generationId: generation.id, status: 'processing' },
      { status: 202 }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack : undefined
    console.error('[generate] UNHANDLED ERROR:', message, stack)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
