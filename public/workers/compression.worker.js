/**
 * PressZero - Dedicated Web Worker for Off-Thread Image Compression
 * Executes dual-axis binary search on an OffscreenCanvas without blocking the UI thread.
 */

self.onmessage = async (e) => {
  const { id, imageBitmap, options } = e.data;
  const startTime = performance.now();

  try {
    const {
      targetKB,
      format = "image/jpeg",
      allowScaling = true,
      signatureEnhance = false,
      signatureThreshold = 210,
    } = options;

    const targetBytes = targetKB * 1024;
    let width = imageBitmap.width;
    let height = imageBitmap.height;

    // Dimension safety ceiling
    const MAX_DIM = 8192;
    if (width > MAX_DIM || height > MAX_DIM) {
      const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    // Allocate OffscreenCanvas
    let canvas = new OffscreenCanvas(width, height);
    let ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("Could not initialize OffscreenCanvas 2D context");

    ctx.drawImage(imageBitmap, 0, 0, width, height);

    // Apply adaptive signature bleach if requested
    if (signatureEnhance) {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      const cutoff = signatureThreshold;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const luma = 0.299 * r + 0.587 * g + 0.114 * b;

        if (luma > cutoff) {
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
        } else {
          const darkFactor = Math.pow(luma / cutoff, 1.4);
          data[i] = Math.round(r * darkFactor * 0.7);
          data[i + 1] = Math.round(g * darkFactor * 0.7);
          data[i + 2] = Math.round(b * darkFactor * 0.7);
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }

    // Dual-axis binary search compression
    let minQ = 0.01;
    let maxQ = 0.98;
    let bestBlob = null;
    let bestSize = Infinity;
    let bestQuality = 0.8;
    let iterations = 0;
    const MAX_ITERATIONS = 12;

    while (iterations < MAX_ITERATIONS && minQ <= maxQ) {
      iterations++;
      const midQ = (minQ + maxQ) / 2;
      const blob = await canvas.convertToBlob({ type: format, quality: midQ });

      if (blob.size <= targetBytes) {
        bestBlob = blob;
        bestSize = blob.size;
        bestQuality = midQ;
        minQ = midQ + 0.03; // Try higher quality
      } else {
        maxQ = midQ - 0.03; // Reduce quality
      }
    }

    // Fallback: If quality reduction alone exceeds targetKB, downscale resolution
    if ((!bestBlob || bestSize > targetBytes) && allowScaling) {
      let scale = 0.9;
      const MIN_SCALE = 0.15;

      while (scale >= MIN_SCALE) {
        iterations++;
        const sW = Math.max(64, Math.round(width * scale));
        const sH = Math.max(64, Math.round(height * scale));

        const scaleCanvas = new OffscreenCanvas(sW, sH);
        const sCtx = scaleCanvas.getContext("2d");
        if (sCtx) {
          sCtx.drawImage(canvas, 0, 0, sW, sH);
          const scaledBlob = await scaleCanvas.convertToBlob({ type: format, quality: 0.65 });

          if (scaledBlob.size <= targetBytes) {
            bestBlob = scaledBlob;
            bestSize = scaledBlob.size;
            width = sW;
            height = sH;
            break;
          }
        }
        scale -= 0.15;
      }
    }

    // Final safety fallback
    if (!bestBlob) {
      bestBlob = await canvas.convertToBlob({ type: format, quality: 0.1 });
      bestSize = bestBlob.size;
    }

    const timeMs = Math.round(performance.now() - startTime);

    self.postMessage({
      id,
      success: true,
      result: {
        blob: bestBlob,
        size: bestSize,
        quality: bestQuality,
        width,
        height,
        iterations,
        timeMs,
      },
    });
  } catch (error) {
    self.postMessage({
      id,
      success: false,
      error: error.message || "Worker compression failed",
    });
  }
};
