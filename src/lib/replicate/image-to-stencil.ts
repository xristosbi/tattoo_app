import sharp from 'sharp'
import replicate from './client'

// Used for text-to-stencil step2: convert flux-schnell output to linework
export async function imageBufferToStencil(imageBuffer: Buffer): Promise<Buffer> {
  const edgeBuf = await sharp(imageBuffer)
    .greyscale()
    .normalise()
    .linear(2.0, -60)
    .blur(0.5)
    .convolve({ width: 3, height: 3, kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1] })
    .normalise()
    .threshold(15)
    .negate()
    .toBuffer()
  return sharp(edgeBuf).blur(1.8).threshold(210).png().toBuffer()
}

const CONTROLNET_SCRIBBLE_VERSION =
  '435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117'

export async function createImageToStencilPrediction(imageBuffer: Buffer, mimeType: string) {
  const b64 = imageBuffer.toString('base64')
  const dataUri = `data:${mimeType};base64,${b64}`

  return await replicate.predictions.create({
    version: CONTROLNET_SCRIBBLE_VERSION,
    input: {
      image: dataUri,
      prompt:
        'tattoo flash art, bold black outlines, white background, stencil ready, no shading, no color, clean lines',
      negative_prompt:
        'color, gray, shading, blurry, noise, watermark',
      num_samples: '1',
      image_resolution: '512',
      detect_resolution: 512,
      ddim_steps: 20,
      scale: 9,
    },
  })
}
