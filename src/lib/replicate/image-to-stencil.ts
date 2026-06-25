import replicate from './client'

export async function createImageToStencilPrediction(imageUrl: string) {
  return await replicate.predictions.create({
    model: 'black-forest-labs/flux-dev',
    input: {
      image: imageUrl,
      prompt:
        'tattoo stencil, black ink linework on pure white background, bold clean lines, high contrast, no color fills, no shading, crisp outlines only, suitable for tattooing',
      strength: 0.8,
      num_inference_steps: 28,
      guidance_scale: 3.5,
      num_outputs: 1,
      output_format: 'png',
      output_quality: 95,
    },
  })
}
