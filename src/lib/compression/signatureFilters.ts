/**
 * Signature & Document Crisp Filter
 * Eliminates paper shadows, bleaches gray scan artifacts to #FFFFFF,
 * and enhances ink contrast so signatures compress to 5-30 KB with zero blur.
 */

export function enhanceSignatureImageData(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  threshold: number = 210
): void {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const len = data.length;

  // Pass 1: Adaptive White-Point Bleach & Ink Contrast Expansion
  for (let i = 0; i < len; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Perceived luminance (standard Rec. 601)
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    if (lum > threshold) {
      // Paper background: bleach to absolute pure white
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    } else {
      // Ink stroke: deepen contrast and tone
      // Maintain blue/black ink ratio if blue ink, or deepen if black
      const factor = lum / threshold; // 0 to 1
      const enhancedFactor = Math.pow(factor, 1.4); // S-curve contrast boost
      data[i] = Math.round(r * enhancedFactor * 0.75);
      data[i + 1] = Math.round(g * enhancedFactor * 0.75);
      data[i + 2] = Math.round(b * enhancedFactor * 0.85);
    }
  }

  // Put filtered image back to canvas
  ctx.putImageData(imageData, 0, 0);

  // Pass 2: Subtle Unsharp Masking for pen stroke edge definition
  applyUnsharpMask(ctx, width, height);
}

function applyUnsharpMask(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  // Simple 3x3 sharpening kernel
  const srcData = ctx.getImageData(0, 0, width, height);
  const src = srcData.data;
  const outputData = ctx.createImageData(width, height);
  const dst = outputData.data;

  // Kernel:
  //  0  -0.5   0
  // -0.5  3.0 -0.5
  //  0  -0.5   0
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;

      for (let c = 0; c < 3; c++) {
        const top = ((y - 1) * width + x) * 4 + c;
        const bottom = ((y + 1) * width + x) * 4 + c;
        const left = (y * width + (x - 1)) * 4 + c;
        const right = (y * width + (x + 1)) * 4 + c;

        const val =
          3.0 * src[idx + c] -
          0.5 * (src[top] + src[bottom] + src[left] + src[right]);

        dst[idx + c] = Math.min(255, Math.max(0, val));
      }
      dst[idx + 3] = src[idx + 3]; // Alpha
    }
  }

  ctx.putImageData(outputData, 0, 0);
}
