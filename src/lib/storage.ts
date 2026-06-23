import type { SupabaseClient } from '@supabase/supabase-js'

const INPUTS_BUCKET = 'inputs'
const STENCILS_BUCKET = 'stencils'

export async function uploadInput(
  supabase: SupabaseClient,
  userId: string,
  file: File
): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${userId}/${crypto.randomUUID()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error } = await supabase.storage
    .from(INPUTS_BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: false })

  if (error) throw new Error(`Failed to upload input: ${error.message}`)
  return path
}

export async function uploadStencilFromUrl(
  supabase: SupabaseClient,
  userId: string,
  generationId: string,
  replicateUrl: string
): Promise<string> {
  const response = await fetch(replicateUrl)
  if (!response.ok) throw new Error('Failed to download output from Replicate')
  const blob = await response.blob()
  const path = `${userId}/${generationId}.png`

  const { error } = await supabase.storage
    .from(STENCILS_BUCKET)
    .upload(path, blob, { contentType: 'image/png', upsert: true })

  if (error) throw new Error(`Failed to upload stencil: ${error.message}`)
  return path
}

export async function getInputSignedUrl(
  supabase: SupabaseClient,
  path: string,
  expiresIn = 3600
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(INPUTS_BUCKET)
    .createSignedUrl(path, expiresIn)
  if (error || !data) throw new Error(`Failed to get input URL: ${error?.message}`)
  return data.signedUrl
}

export async function getStencilSignedUrl(
  supabase: SupabaseClient,
  path: string,
  expiresIn = 604800 // 7 days
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(STENCILS_BUCKET)
    .createSignedUrl(path, expiresIn)
  if (error || !data) throw new Error(`Failed to get stencil URL: ${error?.message}`)
  return data.signedUrl
}
