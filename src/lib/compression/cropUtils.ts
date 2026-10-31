import { AspectRatioMode, CropBox } from "@/types";

/**
 * Image cropping utilities for passport, signature, and square portal specifications.
 */

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function getAspectRatioPreset(mode: AspectRatioMode): number | null {
  switch (mode) {
    case "7:3":
      return 7 / 3;
    case "7:9":
      return 7 / 9;
    case "1:1":
      return 1;
    case "16:9":
      return 16 / 9;
    case "free":
    default:
      return null;
  }
}

export function calculateDefaultCropBox(
  imgW: number,
  imgH: number,
  ratio: number | null
): CropBox {
  if (!ratio) {
    return {
      x: imgW * 0.1,
      y: imgH * 0.1,
      width: imgW * 0.8,
      height: imgH * 0.8,
    };
  }

  let boxW = imgW * 0.85;
  let boxH = boxW / ratio;

  if (boxH > imgH * 0.85) {
    boxH = imgH * 0.85;
    boxW = boxH * ratio;
  }

  return {
    x: (imgW - boxW) / 2,
    y: (imgH - boxH) / 2,
    width: boxW,
    height: boxH,
  };
}

export function getClampedCropBox(
  box: CropBox,
  imgW: number,
  imgH: number
): CropBox {
  const width = Math.min(box.width, imgW);
  const height = Math.min(box.height, imgH);
  const x = Math.max(0, Math.min(box.x, imgW - width));
  const y = Math.max(0, Math.min(box.y, imgH - height));
  return { x, y, width, height };
}

export function cropImage(
  source: HTMLImageElement,
  crop: CropRect
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(crop.width));
    canvas.height = Math.max(1, Math.round(crop.height));
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (!ctx) {
      reject(new Error("Could not initialize canvas for crop"));
      return;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      source,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const croppedImg = new Image();
    croppedImg.onload = () => resolve(croppedImg);
    croppedImg.onerror = reject;
    croppedImg.src = canvas.toDataURL("image/jpeg", 0.98);
  });
}
