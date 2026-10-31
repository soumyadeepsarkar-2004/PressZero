export type ImageFormat = 'image/jpeg' | 'image/webp' | 'image/png' | 'image/avif';

export type AspectRatioMode = '7:3' | '7:9' | '1:1' | '16:9' | 'free';

export interface CropBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CompressionJob {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  previewUrl: string;
  status: 'idle' | 'processing' | 'completed' | 'error';
  targetKB: number;
  format: ImageFormat;
  quality: number; // 0.01 to 1.0
  allowScaling: boolean;
  maxWidth?: number;
  maxHeight?: number;
  signatureEnhance: boolean;
  signatureThreshold: number; // 0 - 255
  resultBlob?: Blob;
  resultUrl?: string;
  resultSize?: number;
  resultWidth?: number;
  resultHeight?: number;
  compressionRatio?: number;
  errorMessage?: string;
  processingTimeMs?: number;
}

export interface PortalPreset {
  id: string;
  category: 'exam' | 'visa' | 'govt' | 'web' | 'social';
  name: string;
  subTitle: string;
  description: string;
  targetKB: number;
  minKB?: number;
  maxKB: number;
  format: ImageFormat;
  defaultWidth?: number;
  defaultHeight?: number;
  aspectRatio?: number; // e.g. 3.5 / 4.5
  requiresSignatureEnhance?: boolean;
  icon: string;
  tags: string[];
}

export interface EngineResult {
  blob: Blob;
  size: number;
  quality: number;
  width: number;
  height: number;
  iterations: number;
  timeMs: number;
}

export interface CompressionOptions {
  targetKB: number;
  minKB?: number;
  maxKB?: number;
  format: ImageFormat;
  allowScaling?: boolean;
  targetWidth?: number;
  targetHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  signatureEnhance?: boolean;
  signatureThreshold?: number;
  strictCeiling?: boolean; // Ensure result never exceeds targetKB
}
