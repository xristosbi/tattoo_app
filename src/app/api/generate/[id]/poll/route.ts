import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export const maxDuration = 60
import { uploadStencilFromUrl, getStencilSignedUrl } from '@/lib/storage'
import { incrementQuota } from '@/lib/quota'
import { createImageToStencilPrediction } from '@/lib/replicate/image-to-stencil'
import replicate from '@/lib/replicate/client'

export async function GET(
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

  const { data: generation } = await adminSupabase
    .from('generations')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!generation) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Already done
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

  if (!generation.replicate_id) {
    return NextResponse.json({ status: 'processing' })
  }

  // Poll Replicate
  try {
    const prediction = await replicate.predictions.get(generation.replicate_id)
    const meta = generation.metadata as Record<string, unknown>

    if (prediction.status === 'failed' || prediction.error) {
      const errorMsg = String(prediction.error ?? 'Replicate prediction failed')
      console.error('[poll] Replicate prediction failed:', errorMsg, { generationId: generation.id })
      await adminSupabase
        .from('generations')
        .update({ status: 'failed', error_message: errorMsg })
        .eq('id', generation.id)

      return NextResponse.json({ status: 'failed', error: errorMsg })
    }

    if (prediction.status !== 'succeeded') {
      return NextResponse.json({ status: 'processing' })
    }

    // For text-to-stencil step 1: advance to step 2
    if (
      generation.type === 'text_to_stencil' &&
      meta.pipeline_step === 'step1'
    ) {
      const output = prediction.output as string[] | string
      const intermediateUrl = Array.isArray(output) ? output[0] : output

      if (!intermediateUrl) {
        await adminSupabase
          .from('generations')
          .update({ status: 'failed', error_message: 'No output from text generation' })
          .eq('id', generation.id)
        return NextResponse.json({ status: 'failed', error: 'No image generated' })
      }

      const step2Prediction = await createImageToStencilPrediction(intermediateUrl)

      await adminSupabase
        .from('generations')
        .update({
          replicate_id: step2Prediction.id,
          metadata: {
            ...meta,
            pipeline_step: 'step2',
            intermediate_image_url: intermediateUrl,
            step2_replicate_id: step2Prediction.id,
          },
        })
        .eq('id', generation.id)

      return NextResponse.json({ status: 'processing' })
    }

    // Final step or image-to-stencil: process the output
    const output = prediction.output as string[] | string
    const outputUrl = Array.isArray(output) ? output[0] : output

    if (!outputUrl) {
      await adminSupabase
        .from('generations')
        .update({ status: 'failed', error_message: 'No output from stencil generation' })
        .eq('id', generation.id)
      return NextResponse.json({ status: 'failed', error: 'No stencil generated' })
    }

    const outputPath = await uploadStencilFromUrl(
      adminSupabase,
      user.id,
      generation.id,
      outputUrl
    )

    await adminSupabase
      .from('generations')
      .update({ status: 'completed', output_storage_path: outputPath })
      .eq('id', generation.id)

    await incrementQuota(adminSupabase, generation.quota_owner_id)

    const stencilUrl = await getStencilSignedUrl(adminSupabase, outputPath)
    return NextResponse.json({ status: 'completed', stencilUrl })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Poll failed'
    return NextResponse.json({ status: 'processing', error: message })
  }
}
