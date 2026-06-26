import sharp from 'sharp'
import replicate from './client'

// Step 1: flux-dev img2img — higher strength so model commits to linework style
export async function createImageToStencilPrediction(imageBuffer: Buffer, mimeType: string) {
  const b64 = imageBuffer.toString('base64')
  const dataUri = `data:${mimeType};base64,${b64}`

  return await replicate.predictions.create({
    model: 'black-forest-labs/flux-dev',
    input: {
      image: dataUri,
      prompt:
        'tattoo flash art stencil, bold black ink outlines only, pure white background, no shading, no gray tones, no color, no fill, clean crisp line art, coloring book style, print ready stencil',
      prompt_strength: 0.78,
      num_inference_steps: 30,
      guidance_scale: 4.0,
      num_outputs: 1,
      output_format: 'png',
      output_quality: 95,
    },
  })
}

// Step 2: edge-detection + line-fattening → pure black bold lines on white
export async function applyStencilPostProcess(imageBuffer: Buffer): Promise<Buffer> {
  // Aggressively stretch contrast so midtones push toward black or white
  const prepped = await sharp(imageBuffer)
    .greyscale()
    .normalise()
    .linear(2.5, -100)
    .blur(0.4)
    .toBuffer()

  // Laplacian edge detection — finds outlines of every shape
  const edgeBuf = await sharp(prepped)
    .convolve({ width: 3, height: 3, kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1] })
    .normalise()
    .threshold(12) // catch even faint edges
    .negate() // edges are black on white background
    .toBuffer()

  // Fatten lines: blur spreads the ink, threshold re-binarizes to pure B&W
  return sharp(edgeBuf)
    .blur(2.2)
    .threshold(215)
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
