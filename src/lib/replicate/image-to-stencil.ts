import sharp from 'sharp'

/**
 * Converts an image buffer to a tattoo stencil using edge detection.
 * Steps: greyscale → gaussian blur (denoise) → Laplacian edges → normalise → threshold → invert
 * Result: crisp black linework on white background.
 */
export async function imageBufferToStencil(imageBuffer: Buffer): Promise<Buffer> {
  return sharp(imageBuffer)
    .greyscale()
    .normalise()
    .blur(0.6) // light denoise before edge detection
    .convolve({
      width: 3,
      height: 3,
      kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1], // Laplacian
    })
    .normalise()
    .threshold(18) // edges → white, background → black
    .negate()       // invert: black lines on white background
    .png()
    .toBuffer()
}
