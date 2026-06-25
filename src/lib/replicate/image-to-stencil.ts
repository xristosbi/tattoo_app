import sharp from 'sharp'

export async function imageBufferToStencil(imageBuffer: Buffer): Promise<Buffer> {
  // Step 1: max contrast greyscale + edge detection
  const edgeBuf = await sharp(imageBuffer)
    .greyscale()
    .normalise()
    .linear(2.0, -60) // aggressive contrast boost before edge detection
    .blur(0.5)
    .convolve({
      width: 3,
      height: 3,
      kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1], // Laplacian
    })
    .normalise()
    .threshold(15)  // low threshold = more edges captured → white
    .negate()       // → black lines on white background
    .toBuffer()

  // Step 2: dilate (thicken) lines by blurring black then re-thresholding
  return sharp(edgeBuf)
    .blur(1.8)        // spreads black lines into grey halo
    .threshold(210)   // anything not near-white → black (bold thick lines)
    .png()
    .toBuffer()
}
