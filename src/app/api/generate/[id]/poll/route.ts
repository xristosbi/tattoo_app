import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { uploadStencilFromUrl, getStencilSignedUrl } from '@/lib/storage'
import { incrementQuota } from '@/lib/quota'
import { imageBufferToStencil, applyStencilPostProcess } from '@/lib/replicate/image-to-stencil'
import replicate from '@/lib/replicate/client'

export const maxDuration = 60

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
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
    return NextResponse.json({ status: 'failed', error: generation.error_message ?? 'Generation failed' })
  }

  if (!generation.replicate_id) {
    return NextResponse.json({ status: 'processing' })
  }

  try {
    const prediction = await replicate.predictions.get(generation.replicate_id)

    if (prediction.status === 'failed' || prediction.error) {
      const errorMsg = String(prediction.error ?? 'Replicate prediction failed')
      console.error('[poll] prediction failed:', errorMsg)
      await adminSupabase
        .from('generations')
        .update({ status: 'failed', error_message: errorMsg })
        .eq('id', generation.id)
      return NextResponse.json({ status: 'failed', error: errorMsg })
    }

    if (prediction.status !== 'succeeded') {
      return NextResponse.json({ status: 'processing' })
    }

    // text-to-stencil step1: flux-schnell produced a base image
    // pass it through sharp edge detection to get stencil linework
    const meta = generation.metadata as Record<string, unknown>
    if (generation.type === 'text_to_stencil' && meta.pipeline_step === 'step1') {
      const output = prediction.output as string[] | string
      const imageUrl = Array.isArray(output) ? output[0] : output

      if (!imageUrl) {
        await adminSupabase
          .from('generations')
          .update({ status: 'failed', error_message: 'No output from text generation' })
          .eq('id', generation.id)
        return NextResponse.json({ status: 'failed', error: 'No image generated' })
      }

      // Download and convert to stencil with sharp
      const imgRes = await fetch(imageUrl)
      if (!imgRes.ok) throw new Error('Failed to download generated image')
      const inputBuffer = Buffer.from(await imgRes.arrayBuffer())
      const stencilBuffer = await imageBufferToStencil(inputBuffer)

      const outputPath = `${user.id}/${generation.id}.png`
      const { error: uploadError } = await adminSupabase.storage
        .from('stencils')
        .upload(outputPath, stencilBuffer, { contentType: 'image/png', upsert: true })

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

      await adminSupabase
        .from('generations')
        .update({ status: 'completed', output_storage_path: outputPath, metadata: { ...meta, pipeline_step: 'done' } })
        .eq('id', generation.id)

      await incrementQuota(adminSupabase, generation.quota_owner_id)
      const stencilUrl = await getStencilSignedUrl(adminSupabase, outputPath)
      return NextResponse.json({ status: 'completed', stencilUrl })
    }

    // image-to-stencil: flux-dev output → apply sharp post-process for pure B&W
    const output = prediction.output as string[] | string
    const outputUrl = Array.isArray(output) ? output[0] : output

    if (!outputUrl) {
      await adminSupabase
        .from('generations')
        .update({ status: 'failed', error_message: 'No output from stencil generation' })
        .eq('id', generation.id)
      return NextResponse.json({ status: 'failed', error: 'No stencil generated' })
    }

    // Download flux-dev output and apply threshold to maximize contrast
    const rawRes = await fetch(outputUrl)
    if (!rawRes.ok) throw new Error('Failed to download stencil output')
    const rawBuffer = Buffer.from(await rawRes.arrayBuffer())
    const stencilBuffer = await applyStencilPostProcess(rawBuffer)

    const outputPath = `${user.id}/${generation.id}.png`
    const { error: uploadError } = await adminSupabase.storage
      .from('stencils')
      .upload(outputPath, stencilBuffer, { contentType: 'image/png', upsert: true })

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

    await adminSupabase
      .from('generations')
      .update({ status: 'completed', output_storage_path: outputPath })
      .eq('id', generation.id)

    await incrementQuota(adminSupabase, generation.quota_owner_id)

    const stencilUrl = await getStencilSignedUrl(adminSupabase, outputPath)
    return NextResponse.json({ status: 'completed', stencilUrl })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Poll failed'
    console.error('[poll] error:', message)
    return NextResponse.json({ status: 'processing', error: message })
  }
}
