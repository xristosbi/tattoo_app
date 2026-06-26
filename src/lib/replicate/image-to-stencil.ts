import sharp from 'sharp'
import replicate from './client'

// instruct-pix2pix: transforms photos based on a text instruction
// Takes the actual uploaded image + instruction → returns stencil-style output
const INSTRUCT_PIX2PIX_VERSION =
  '30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f'

export async function createImageToStencilPrediction(imageBuffer: Buffer, mimeType: string) {
  const b64 = imageBuffer.toString('base64')
  const dataUri = `data:${mimeType};base64,${b64}`

  return await replicate.predictions.create({
    version: INSTRUCT_PIX2PIX_VERSION,
    input: {
      image: dataUri,
      prompt:
        'convert to tattoo stencil, bold black outlines on pure white background, coloring book style, clean linework only, no shading, no color, no gray, high contrast black and white line art',
      negative_prompt:
        'color, shading, gray, gradients, watermark, blurry, low quality',
      num_inference_steps: 80,
      image_guidance_scale: 1.8,
      guidance_scale: 9,
    },
  })
}

// Used for text-to-stencil step2: convert flux-schnell output to linework with sharp
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
