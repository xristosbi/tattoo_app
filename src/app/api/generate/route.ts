import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { checkQuota, incrementQuota } from '@/lib/quota'
import { getStencilSignedUrl } from '@/lib/storage'
import openai from '@/lib/openai/client'
import sharp from 'sharp'
import { toFile } from 'openai'

export const maxDuration = 120

const MAX_FILE_SIZE = 10 * 1024 * 1024

// SECURITY: master prompt never leaves server
const MASTER_STENCIL_PROMPT =
  'Transform the uploaded image into a professional black-and-white tattoo stencil for professional tattoo artists. Preserve the subject\'s proportions, pose, composition, and all important details exactly as in the original image. Create a clean vector-like line drawing on a pure white background. Use bold clean outer contours for the silhouette and major forms. Use medium-weight lines for internal details. Do NOT use grayscale solid fills gradients crosshatching or black shadow fills. Replace every shadow area with thin dashed contour lines. Use different densities: sparse = light shadow, medium = mid-tone, dense = dark shadow. Pure black ink on pure white background. Professional tattoo stencil style, extremely clean crisp line art suitable for printing.'

async function buildStencilPrompt(userNotes: string | null): Promise<string> {
  if (!userNotes || !userNotes.trim()) return MASTER_STENCIL_PROMPT

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          'You are a tattoo stencil assistant. Merge the artist notes into the following master stencil instruction to produce one combined image-generation instruction. Output only the final instruction text, no extra commentary. The result must still be pure black ink on white background, clean line art only, no fills or gradients.',
      },
      {
        role: 'user',
        content: `Master instruction: ${MASTER_STENCIL_PROMPT}\n\nArtist notes: ${userNotes.trim()}`,
      },
    ],
    max_tokens: 300,
  })
  return completion.choices[0]?.message?.content?.trim() ?? MASTER_STENCIL_PROMPT
}

async function applyStencilPostProcess(imageBuffer: Buffer): Promise<Buffer> {
  const prepped = await sharp(imageBuffer)
    .greyscale()
    .normalise()
    .linear(2.5, -100)
    .blur(0.4)
    .toBuffer()
  const edgeBuf = await sharp(prepped)
    .convolve({ width: 3, height: 3, kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1] })
    .normalise()
    .threshold(12)
    .negate()
    .toBuffer()
  return sharp(edgeBuf).blur(2.2).threshold(215).png().toBuffer()
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const adminSupabase = createAdminClient()

    // Server-side quota enforcement
    const quota = await checkQuota(adminSupabase, user.id)
    if (!quota.allowed) {
      return NextResponse.json(
        { error: 'quota_exceeded', tier: quota.tier, limit: quota.limit, used: quota.used },
        { status: 429 }
      )
    }

    const formData = await request.formData()
    const type = formData.get('type') as string | null
    const prompt = formData.get('prompt') as string | null
    const notes = formData.get('notes') as string | null
    const file = formData.get('file') as File | null

    if (!type || !['image_to_stencil', 'text_to_stencil'].includes(type)) {
      return NextResponse.json({ error: 'Invalid generation type' }, { status: 400 })
    }
    if (type === 'image_to_stencil' && !file) {
      return NextResponse.json({ error: 'File required' }, { status: 400 })
    }
    if (type === 'text_to_stencil' && (!prompt || prompt.trim().length < 3)) {
      return NextResponse.json({ error: 'Prompt too short' }, { status: 400 })
    }
    if (file && file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 413 })
    }

    const { data: generation, error: genError } = await adminSupabase
      .from('generations')
      .insert({
        user_id: user.id,
        quota_owner_id: user.id,
        type: type as 'image_to_stencil' | 'text_to_stencil',
        status: 'processing',
        prompt: prompt ?? null,
        metadata: {},
      })
      .select()
      .single()

    if (genError || !generation) {
      return NextResponse.json({ error: `DB error: ${genError?.message}` }, { status: 500 })
    }

    let outputBuffer: Buffer

    if (type === 'image_to_stencil' && file) {
      const imageBuffer = Buffer.from(await file.arrayBuffer())
      const stencilPrompt = await buildStencilPrompt(notes)

      const imageFile = await toFile(imageBuffer, 'input.png', {
        type: file.type || 'image/png',
      })

      const response = await openai.images.edit({
        model: 'gpt-image-1',
        image: imageFile,
        prompt: stencilPrompt,
        size: '1024x1024',
        n: 1,
      })

      const imgData = response.data?.[0]
      const b64 = imgData?.b64_json
      if (!b64) throw new Error('No image returned from OpenAI')
      const rawBuffer = Buffer.from(b64, 'base64')
      outputBuffer = await applyStencilPostProcess(rawBuffer)
    } else {
      // text_to_stencil: build a stencil-oriented text prompt
      const textStencilPrompt = `${MASTER_STENCIL_PROMPT} Subject matter: ${prompt!.trim()}`

      const response = await openai.images.generate({
        model: 'gpt-image-1',
        prompt: textStencilPrompt,
        size: '1024x1024',
        n: 1,
      })

      const imgData = response.data?.[0]
      const b64 = imgData?.b64_json
      if (!b64) {
        const imgUrl = imgData?.url
        if (!imgUrl) throw new Error('No image returned from OpenAI')
        const imgRes = await fetch(imgUrl)
        outputBuffer = await applyStencilPostProcess(Buffer.from(await imgRes.arrayBuffer()))
      } else {
        outputBuffer = await applyStencilPostProcess(Buffer.from(b64, 'base64'))
      }
    }

    const outputPath = `${user.id}/${generation.id}.png`
    const { error: uploadError } = await adminSupabase.storage
      .from('stencils')
      .upload(outputPath, outputBuffer, { contentType: 'image/png', upsert: true })

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

    await adminSupabase
      .from('generations')
      .update({ status: 'completed', output_storage_path: outputPath })
      .eq('id', generation.id)

    await incrementQuota(adminSupabase, user.id)

    const stencilUrl = await getStencilSignedUrl(adminSupabase, outputPath)

    return NextResponse.json({ generationId: generation.id, status: 'completed', stencilUrl })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[generate] error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
