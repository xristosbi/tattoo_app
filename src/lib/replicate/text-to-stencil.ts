import replicate from './client'

const FLUX_SCHNELL_MODEL = 'black-forest-labs/flux-schnell'

const STENCIL_SUFFIX =
  ', tattoo design, black ink linework on white background, bold clean lines, high contrast, no color fills, no gradients, suitable for tattooing, flash art style, detailed illustration'

export async function createTextToImagePrediction(prompt: string) {
  return await replicate.predictions.create({
    model: FLUX_SCHNELL_MODEL,
    input: {
      prompt: prompt + STENCIL_SUFFIX,
      num_outputs: 1,
      num_inference_steps: 4,
      output_format: 'png',
      output_quality: 90,
    },
  })
}
