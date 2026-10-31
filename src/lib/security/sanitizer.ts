/**
 * PressZero Security Sanitizer & Input Verifier
 * Defensive verification against decompression bombs, file spoofing, and malicious payloads.
 */

export interface ValidationResult {
  valid: boolean;
  detectedMime: string;
  error?: string;
}

export const MAX_SAFE_DIMENSION = 8192;
export const MAX_SAFE_MEGAPIXELS = 16.0; // 16,777,216 pixels
export const MAX_SAFE_PIXELS = MAX_SAFE_MEGAPIXELS * 1024 * 1024;
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB safe memory ceiling
export const MAX_QUEUE_SIZE = 100; // 100 files max batch limit

/**
 * Validates file size and constraints before memory allocation
 */
export function validateFileInput(file: File | Blob): { valid: boolean; error?: string } {
  if (file.size <= 0) {
    return { valid: false, error: "Empty file: File size is 0 bytes." };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { 
      valid: false, 
      error: `File size exceeds the 50MB maximum ceiling (${(file.size / 1048576).toFixed(1)}MB). Please choose a smaller file.` 
    };
  }

  return { valid: true };
}

/**
 * Sanitizes file names to prevent path traversal, XSS, and filesystem injection in ZIP extraction
 */
export function sanitizeFilename(
  rawName: string,
  fallbackBase = "compressed_asset"
): string {
  if (!rawName || typeof rawName !== "string") {
    return fallbackBase;
  }

  // 1. Remove directory traversal and dangerous characters
  const clean = rawName
    .replace(/[/\\]/g, "_") // strip path separators
    .replace(/\.\.+/g, ".")  // replace multiple dots like ..
    .replace(/[<>:"|?*\x00-\x1F]/g, "_") // strip illegal filename chars
    .trim();

  // 2. Separate extension from base name
  const lastDotIndex = clean.lastIndexOf(".");
  let base = lastDotIndex !== -1 ? clean.substring(0, lastDotIndex) : clean;
  let ext = lastDotIndex !== -1 ? clean.substring(lastDotIndex + 1) : "";

  // Clean base and ext
  base = base.replace(/[^a-zA-Z0-9_\-.]/g, "_").substring(0, 64);
  ext = ext.replace(/[^a-zA-Z0-9]/g, "").substring(0, 8);

  // 3. Avoid Windows reserved device names
  const WINDOWS_RESERVED = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;
  if (WINDOWS_RESERVED.test(base)) {
    base = `file_${base}`;
  }

  if (!base || base.length === 0) {
    base = fallbackBase;
  }

  return ext ? `${base}.${ext}` : base;
}

/**
 * Sniffs binary magic numbers from the first 16 bytes of an ArrayBuffer
 */
export function verifyImageMagicBytes(buffer: ArrayBuffer): ValidationResult {
  const bytes = new Uint8Array(buffer.slice(0, 16));

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { valid: true, detectedMime: "image/jpeg" };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return { valid: true, detectedMime: "image/png" };
  }

  // GIF: 47 49 46 38
  if (
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38
  ) {
    return { valid: true, detectedMime: "image/gif" };
  }

  // WebP: RIFF .... WEBP
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return { valid: true, detectedMime: "image/webp" };
  }

  // SVG: Inspect text for dangerous tags
  const textSample = new TextDecoder().decode(bytes).trim();
  if (textSample.startsWith("<?xml") || textSample.startsWith("<svg")) {
    return {
      valid: false,
      detectedMime: "image/svg+xml",
      error: "Direct SVG compression is disabled to prevent script injection. Use PNG or JPEG raster inputs.",
    };
  }

  return {
    valid: false,
    detectedMime: "application/octet-stream",
    error: "Invalid image header. File format signature does not match supported image types.",
  };
}

/**
 * Calculates pre-emptive scaling factors to prevent memory crashes on decompression bombs
 */
export function calculateSafeDimensions(
  width: number,
  height: number
): { width: number; height: number; wasDownscaled: boolean } {
  const totalPixels = width * height;

  if (
    width <= MAX_SAFE_DIMENSION &&
    height <= MAX_SAFE_DIMENSION &&
    totalPixels <= MAX_SAFE_PIXELS
  ) {
    return { width, height, wasDownscaled: false };
  }

  const dimensionRatio = Math.min(
    MAX_SAFE_DIMENSION / width,
    MAX_SAFE_DIMENSION / height,
    Math.sqrt(MAX_SAFE_PIXELS / totalPixels)
  );

  const safeWidth = Math.max(100, Math.round(width * dimensionRatio));
  const safeHeight = Math.max(100, Math.round(height * dimensionRatio));

  return {
    width: safeWidth,
    height: safeHeight,
    wasDownscaled: true,
  };
}
