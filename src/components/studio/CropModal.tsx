"use client";

import React, { useState, useRef, useEffect } from "react";
import { Crop, X, Check } from "lucide-react";
import { AspectRatioMode, CropBox } from "@/types";
import { getAspectRatioPreset, calculateDefaultCropBox, getClampedCropBox } from "@/lib/compression/cropUtils";

interface CropModalProps {
  image: HTMLImageElement;
  isOpen: boolean;
  onClose: () => void;
  onApplyCrop: (croppedImage: HTMLImageElement) => void;
}

export default function CropModal({
  image,
  isOpen,
  onClose,
  onApplyCrop,
}: CropModalProps) {
  const [aspectMode, setAspectMode] = useState<AspectRatioMode>("7:3");
  const containerRef = useRef<HTMLDivElement>(null);

  const imgW = image.naturalWidth || image.width;
  const imgH = image.naturalHeight || image.height;

  // Internal crop box coordinates relative to natural image dimensions
  const [cropBox, setCropBox] = useState<CropBox>(() =>
    calculateDefaultCropBox(imgW, imgH, getAspectRatioPreset("7:3"))
  );

  const isDragging = useRef<boolean>(false);
  const dragStart = useRef<{ x: number; y: number; box: CropBox }>({
    x: 0,
    y: 0,
    box: cropBox,
  });

  // Update crop box when aspect ratio preset changes
  useEffect(() => {
    const ratio = getAspectRatioPreset(aspectMode);
    setCropBox(calculateDefaultCropBox(imgW, imgH, ratio));
  }, [aspectMode, imgW, imgH]);

  if (!isOpen) return null;

  const handleApply = () => {
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(cropBox.width);
    canvas.height = Math.round(cropBox.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(
      image,
      cropBox.x,
      cropBox.y,
      cropBox.width,
      cropBox.height,
      0,
      0,
      cropBox.width,
      cropBox.height
    );

    const croppedImg = new Image();
    croppedImg.onload = () => {
      onApplyCrop(croppedImg);
      onClose();
    };
    croppedImg.src = canvas.toDataURL();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 motion-safe:animate-fade-in">
      <div className="w-full max-w-3xl rounded-xl panel-console overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-[var(--color-rule)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[var(--color-paper-2)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-ink)]">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-[var(--color-ink)]">
                Focal cropper and aspect ratio
              </h3>
              <p className="text-[11px] text-[var(--color-muted)]">
                Crop directly to passport, visa, or signature specifications.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-2)] transition-colors duration-150 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Aspect Ratio Presets */}
        <div className="px-5 py-2.5 bg-[var(--color-paper-3)] border-b border-[var(--color-rule)] flex flex-wrap items-center gap-2">
          <span className="text-xs text-[var(--color-muted)] mr-1">Preset ratios:</span>
          {[
            { id: "7:3", label: "7:3 Signature" },
            { id: "7:9", label: "7:9 Passport" },
            { id: "1:1", label: "1:1 Square (US Visa)" },
            { id: "16:9", label: "16:9 Banner" },
            { id: "free", label: "Freeform" },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setAspectMode(mode.id as AspectRatioMode)}
              className={`px-2.5 py-1 rounded-md text-xs transition-colors duration-150 cursor-pointer border ${
                aspectMode === mode.id
                  ? "bg-[var(--color-paper-2)] border-[var(--color-ink)] text-[var(--color-ink)] font-medium"
                  : "bg-[var(--color-paper)] border-[var(--color-rule)] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Interactive Crop Viewport */}
        <div className="p-6 flex-1 flex flex-col items-center justify-center panel-well overflow-hidden relative">
          <div
            ref={containerRef}
            className="relative max-w-full max-h-[460px] select-none rounded-lg overflow-hidden border border-[var(--color-rule)]"
          >
            <img
              src={image.src}
              alt="Crop source"
              className="max-h-[440px] w-auto object-contain block pointer-events-none"
            />

            {/* Crop Overlay Mask */}
            <div
              style={{
                left: `${(cropBox.x / imgW) * 100}%`,
                top: `${(cropBox.y / imgH) * 100}%`,
                width: `${(cropBox.width / imgW) * 100}%`,
                height: `${(cropBox.height / imgH) * 100}%`,
              }}
              className="absolute border-2 border-[var(--color-ink)] outline outline-[9999px] outline-black/60 cursor-move"
              onMouseDown={(e) => {
                isDragging.current = true;
                dragStart.current = {
                  x: e.clientX,
                  y: e.clientY,
                  box: { ...cropBox },
                };
              }}
              onMouseMove={(e) => {
                if (!isDragging.current || !containerRef.current) return;
                const rect = containerRef.current.getBoundingClientRect();
                const scaleX = imgW / rect.width;
                const scaleY = imgH / rect.height;

                const deltaX = (e.clientX - dragStart.current.x) * scaleX;
                const deltaY = (e.clientY - dragStart.current.y) * scaleY;

                const newBox: CropBox = {
                  ...dragStart.current.box,
                  x: dragStart.current.box.x + deltaX,
                  y: dragStart.current.box.y + deltaY,
                };

                setCropBox(getClampedCropBox(newBox, imgW, imgH));
              }}
              onMouseUp={() => {
                isDragging.current = false;
              }}
              onMouseLeave={() => {
                isDragging.current = false;
              }}
            >
              {/* Rule of Thirds Guide Grid */}
              <div className="absolute inset-x-0 top-1/3 border-b border-[var(--color-rule-2)]" />
              <div className="absolute inset-x-0 top-2/3 border-b border-[var(--color-rule-2)]" />
              <div className="absolute inset-y-0 left-1/3 border-r border-[var(--color-rule-2)]" />
              <div className="absolute inset-y-0 left-2/3 border-r border-[var(--color-rule-2)]" />

              {/* Dimension Readout Badge */}
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] text-[var(--color-ink)]">
                <span className="font-measured">{Math.round(cropBox.width)}</span> × <span className="font-measured">{Math.round(cropBox.height)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-[var(--color-rule)] bg-[var(--color-paper-3)] flex items-center justify-between">
          <div className="text-xs text-[var(--color-muted)]">
            Dimensions: <strong className="text-[var(--color-ink)] font-normal"><span className="font-measured">{Math.round(cropBox.width)}</span> × <span className="font-measured">{Math.round(cropBox.height)}</span> px</strong>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="btn-ghost px-3 py-1.5 rounded-md text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="btn-primary flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-medium cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply crop</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
