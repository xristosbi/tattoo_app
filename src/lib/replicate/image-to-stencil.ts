import replicate from './client'

const CONTROLNET_SCRIBBLE_VERSION =
  '435061a1b5a4c1e26740464bf786efdfa9cb3a3a473eca2fc5feab7e55ace225'

export async function createImageToStencilPrediction(imageUrl: string) {
  return await replicate.predictions.create({
    version: CONTROLNET_SCRIBBLE_VERSION,
    input: {
      image: imageUrl,
      prompt:
        'tattoo stencil, black ink linework on white background, clean bold lines, suitable for tattooing, high contrast',
      num_samples: '1',
      image_resolution: '512',
      detect_resolution: 512,
      ddim_steps: 20,
      scale: 9,
      a_prompt: 'best quality, extremely detailed, black on white, crisp lines',
      n_prompt:
        'lowres, bad anatomy, bad hands, missing fingers, cropped, worst quality, low quality, color, gradient, watermark, text',
    },
  })
}
