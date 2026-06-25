import replicate from './client'

// Temporary: use flux-schnell to test Replicate connectivity
// TODO: switch back to controlnet-scribble once Replicate API is confirmed working
export async function createImageToStencilPrediction(_imageUrl: string) {
  return await replicate.predictions.create({
    model: 'black-forest-labs/flux-schnell',
    input: {
      prompt: 'tattoo stencil design, bold black ink linework on white background, no color, high contrast, clean lines',
      num_outputs: 1,
      num_inference_steps: 4,
      output_format: 'png',
      output_quality: 90,
    },
  })
}
