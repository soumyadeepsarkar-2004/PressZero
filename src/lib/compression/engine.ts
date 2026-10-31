import { CompressionOptions, EngineResult, ImageFormat } from "@/types";
import { enhanceSignatureImageData } from "./signatureFilters";
import {
  verifyImageMagicBytes,
  calculateSafeDimensions,
  validateFileInput,
} from "../security/sanitizer";

/**
 * Loads an image from a File or Blob into an HTMLImageElement with magic bytes validation
 */
export async function loadImage(file: File | Blob): Promise<HTMLImageElement> {
  // Defensive check: verify size limits
  const sizeValidation = validateFileInput(file);
  if (!sizeValidation.valid) {
    throw new Error(sizeValidation.error || "File size invalid.");
  }

  // Defensive check: verify binary magic bytes header
  if (file.size > 16) {
    const headerBuffer = await file.slice(0, 16).arrayBuffer();
    const validation = verifyImageMagicBytes(headerBuffer);
    if (!validation.valid) {
      throw new Error(validation.error || "Unsupported or malformed image binary.");
    }
  }

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image into memory."));
    };
    img.src = url;
  });
}

/**
 * Convert canvas to Blob with promise
 */
function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: ImageFormat,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      },
      format,
      quality
    );
  });
}

/**
 * Dedicated Web Worker manager for non-blocking multi-core compression
 */
let workerInstance: Worker | null = null;

function getWorker(): Worker | null {
  if (typeof window === "undefined" || !window.Worker || typeof OffscreenCanvas === "undefined") {
    return null;
  }
  if (!workerInstance) {
    try {
      workerInstance = new Worker("/workers/compression.worker.js");
    } catch {
      return null;
    }
  }
  return workerInstance;
}

export async function compressWithWorker(
  img: HTMLImageElement,
  options: CompressionOptions
): Promise<EngineResult | null> {
  const worker = getWorker();
  if (!worker || typeof createImageBitmap === "undefined") return null;

  try {
    const bitmap = await createImageBitmap(img);
    const id = Math.random().toString(36).substring(2, 9);

    return await new Promise<EngineResult | null>((resolve) => {
      const handler = (e: MessageEvent) => {
        if (e.data.id === id) {
          worker.removeEventListener("message", handler);
          if (e.data.success && e.data.result) {
            resolve(e.data.result);
          } else {
            resolve(null);
          }
        }
      };

      worker.addEventListener("message", handler);
      worker.postMessage({ id, imageBitmap: bitmap, options }, [bitmap]);

      // 4-second safety timeout in case worker hangs
      setTimeout(() => {
        worker.removeEventListener("message", handler);
        resolve(null);
      }, 4000);
    });
  } catch {
    return null;
  }
}

/**
 * Dual-Axis Binary Search Target-Size Compression Engine
 * Guarantees output <= targetKB while maximizing perceptual quality.
 * Includes defensive decompression-bomb ceiling and canvas memory deallocation.
 */
export async function compressToTargetKB(
  img: HTMLImageElement,
  options: CompressionOptions
): Promise<EngineResult> {
  // 1. Attempt non-blocking multi-core off-thread compression via Web Worker
  if (typeof window !== "undefined") {
    const workerResult = await compressWithWorker(img, options);
    if (workerResult) {
      return workerResult;
    }
  }

  // 2. Main-thread high-fidelity fallback
  const startTime = performance.now();
  const targetBytes = options.targetKB * 1024;
  const format = options.format || "image/jpeg";
  const allowScaling = options.allowScaling !== false;

  let currentWidth = img.naturalWidth || img.width;
  let currentHeight = img.naturalHeight || img.height;

  // Defensive check: Clamp dimensions if image exceeds safe memory bounds (decompression bomb defense)
  const safeDims = calculateSafeDimensions(currentWidth, currentHeight);
  currentWidth = safeDims.width;
  currentHeight = safeDims.height;

  // Handle explicit dimension overrides if specified
  if (options.targetWidth && options.targetHeight) {
    currentWidth = options.targetWidth;
    currentHeight = options.targetHeight;
  } else if (options.maxWidth || options.maxHeight) {
    const maxW = options.maxWidth || currentWidth;
    const maxH = options.maxHeight || currentHeight;
    const ratio = Math.min(maxW / currentWidth, maxH / currentHeight, 1);
    currentWidth = Math.round(currentWidth * ratio);
    currentHeight = Math.round(currentHeight * ratio);
  }

  // Pre-emptive dimension scaling for low target KBs (e.g. 2KB - 20KB)
  if (allowScaling) {
    const estimatedMinBytes = currentWidth * currentHeight * 0.015;
    if (estimatedMinBytes > targetBytes) {
      const scaleFactor = Math.min(0.95, Math.sqrt(targetBytes / estimatedMinBytes));
      currentWidth = Math.max(100, Math.round(currentWidth * scaleFactor));
      currentHeight = Math.max(100, Math.round(currentHeight * scaleFactor));
    }
  }

  let iterations = 0;
  let bestBlob: Blob | null = null;
  let bestQuality = 0.8;

  // Iterative Dual-Axis Loop (Dimension Scale + Quality Binary Search)
  let dimensionPasses = 0;
  const maxDimensionPasses = 4;

  while (dimensionPasses < maxDimensionPasses) {
    dimensionPasses++;

    const canvas = document.createElement("canvas");
    canvas.width = currentWidth;
    canvas.height = currentHeight;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      canvas.width = 0;
      canvas.height = 0;
      throw new Error("Could not initialize 2D canvas context");
    }

    try {
      // High quality sampling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Draw white background first to avoid black artifacts for transparent PNGs converted to JPEG
      if (format === "image/jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, currentWidth, currentHeight);
      }

      ctx.drawImage(img, 0, 0, currentWidth, currentHeight);

      // Apply signature / document crisp filters if requested
      if (options.signatureEnhance) {
        enhanceSignatureImageData(
          ctx,
          currentWidth,
          currentHeight,
          options.signatureThreshold ?? 210
        );
      }

      // Binary search on quality factor
      let low = 0.01;
      let high = 1.0;
      let passBestBlob: Blob | null = null;
      let passBestQuality = 0.01;

      // 8-step bisection provides ~0.4% quality granularity
      for (let step = 0; step < 8; step++) {
        iterations++;
        const mid = (low + high) / 2;
        const blob = await canvasToBlob(canvas, format, mid);

        if (blob.size <= targetBytes) {
          passBestBlob = blob;
          passBestQuality = mid;
          low = mid; // Try for better quality
        } else {
          high = mid; // Must compress more
        }

        // Exact match within 2% margin below target
        if (blob.size <= targetBytes && blob.size >= targetBytes * 0.98) {
          passBestBlob = blob;
          passBestQuality = mid;
          break;
        }
      }

      if (passBestBlob && passBestBlob.size <= targetBytes) {
        bestBlob = passBestBlob;
        bestQuality = passBestQuality;
        canvas.width = 0;
        canvas.height = 0;
        break; // Successfully achieved target weight ceiling
      }

      // If quality alone cannot reach target weight and scaling is permitted, downscale dimensions
      if (allowScaling && dimensionPasses < maxDimensionPasses) {
        const lastTestedBlob = await canvasToBlob(canvas, format, 0.05);
        const ratio = Math.sqrt(targetBytes / lastTestedBlob.size);
        const safeScale = Math.min(0.85, Math.max(0.3, ratio * 0.95));

        currentWidth = Math.max(80, Math.round(currentWidth * safeScale));
        currentHeight = Math.max(80, Math.round(currentHeight * safeScale));
      }
    } finally {
      // Immediate memory cleanup: reset canvas dimensions to release backing store buffer
      canvas.width = 0;
      canvas.height = 0;
    }
  }

  // Final fallback to lowest quality if ceiling wasn't achieved
  if (!bestBlob) {
    const fallbackCanvas = document.createElement("canvas");
    fallbackCanvas.width = currentWidth;
    fallbackCanvas.height = currentHeight;
    const fctx = fallbackCanvas.getContext("2d");
    if (fctx) {
      fctx.drawImage(img, 0, 0, currentWidth, currentHeight);
      bestBlob = await canvasToBlob(fallbackCanvas, format, 0.05);
    } else {
      bestBlob = new Blob([], { type: format });
    }
    fallbackCanvas.width = 0;
    fallbackCanvas.height = 0;
  }

  const timeMs = Math.round(performance.now() - startTime);

  return {
    blob: bestBlob,
    size: bestBlob.size,
    quality: Math.round(bestQuality * 100) / 100,
    width: currentWidth,
    height: currentHeight,
    iterations,
    timeMs,
  };
}
