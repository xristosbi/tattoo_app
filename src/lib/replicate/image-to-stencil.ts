import sharp from 'sharp'
import replicate from './client'

// Step 1: flux-dev img2img — keeps structure of original, converts style to stencil
export async function createImageToStencilPrediction(imageBuffer: Buffer, mimeType: string) {
  const b64 = imageBuffer.toString('base64')
  const dataUri = `data:${mimeType};base64,${b64}`

  return await replicate.predictions.create({
    model: 'black-forest-labs/flux-dev',
    input: {
      image: dataUri,
      prompt:
        'tattoo stencil, bold black outlines only, pure white background, no shading, no color, no gray, no fill, clean line art, coloring book style, print ready',
      prompt_strength: 0.6,
      num_inference_steps: 28,
      guidance_scale: 3.5,
      num_outputs: 1,
      output_format: 'png',
      output_quality: 95,
    },
  })
}

// Step 2: maximize contrast — pure black lines on pure white background
export async function applyStencilPostProcess(imageBuffer: Buffer): Promise<Buffer> {
  return sharp(imageBuffer)
    .greyscale()
    .normalise()
    .threshold(180) // anything below 180 → black, above → white
    .png()
    .toBuffer()
}

// Used for text-to-stencil step2: sharp edge detection on flux-schnell output
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
