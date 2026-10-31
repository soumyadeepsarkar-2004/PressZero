"use client";

import React, { useState, useRef, useEffect } from "react";
import { ZoomIn, X, Split, Columns2, Move } from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface PixelLoupeModalProps {
  originalSrc: string;
  compressedSrc: string;
  originalSize: number;
  compressedSize: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function PixelLoupeModal({
  originalSrc,
  compressedSrc,
  originalSize,
  compressedSize,
  isOpen,
  onClose,
}: PixelLoupeModalProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(4); // 1x, 2x, 4x, 8x
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [viewMode, setViewMode] = useState<"split" | "side">("split");
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isPanning = useRef<boolean>(false);
  const panStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "1") setZoomLevel(1);
      if (e.key === "2") setZoomLevel(2);
      if (e.key === "4") setZoomLevel(4);
      if (e.key === "8") setZoomLevel(8);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 motion-safe:animate-fade-in">
      <div className="w-full max-w-5xl h-[85vh] rounded-xl panel-console overflow-hidden flex flex-col">
        {/* Top Header & Toolbar */}
        <div className="px-5 py-3.5 border-b border-[var(--color-rule)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[var(--color-paper-2)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-ink)]">
              <ZoomIn className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-[var(--color-ink)]">
                800% pixel inspection loupe
              </h3>
              <p className="text-[11px] text-[var(--color-muted)]">
                Inspect DCT compression blocks, stroke sharpness, and noise.
              </p>
            </div>
          </div>

          {/* Controls: Zoom & View Mode */}
          <div className="flex items-center gap-2.5">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-[var(--color-paper-3)] p-0.5 rounded-md border border-[var(--color-rule)] text-xs">
              <button
                onClick={() => setViewMode("split")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors duration-150 cursor-pointer ${
                  viewMode === "split"
                    ? "bg-[var(--color-paper-2)] text-[var(--color-ink)] font-medium border border-[var(--color-rule-2)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                }`}
              >
                <Split className="w-3.5 h-3.5" /> Split
              </button>
              <button
                onClick={() => setViewMode("side")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors duration-150 cursor-pointer ${
                  viewMode === "side"
                    ? "bg-[var(--color-paper-2)] text-[var(--color-ink)] font-medium border border-[var(--color-rule-2)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                }`}
              >
                <Columns2 className="w-3.5 h-3.5" /> Side-by-side
              </button>
            </div>

            {/* Zoom Levels */}
            <div className="flex items-center gap-1 bg-[var(--color-paper-3)] p-0.5 rounded-md border border-[var(--color-rule)] text-xs">
              {[1, 2, 4, 8].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setZoomLevel(lvl)}
                  className={`px-2 py-0.5 rounded text-xs transition-colors duration-150 cursor-pointer ${
                    zoomLevel === lvl
                      ? "bg-[var(--color-paper-2)] text-[var(--color-ink)] font-medium border border-[var(--color-ink)]"
                      : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  <span className="font-measured">{lvl}</span>x
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-md text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-2)] transition-colors duration-150 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Loupe Viewport with Pan & Nearest-Neighbor Rendering */}
        <div
          onMouseDown={(e) => {
            isPanning.current = true;
            panStart.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
          }}
          onMouseMove={(e) => {
            if (isPanning.current) {
              setPanOffset({
                x: e.clientX - panStart.current.x,
                y: e.clientY - panStart.current.y,
              });
            }
          }}
          onMouseUp={() => {
            isPanning.current = false;
          }}
          onMouseLeave={() => {
            isPanning.current = false;
          }}
          className="relative flex-1 panel-well overflow-hidden cursor-grab active:cursor-grabbing select-none"
        >
          {viewMode === "split" ? (
            /* Split Slider View */
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Scaled Original Image (Left Half) */}
              <div
                style={{
                  clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                  imageRendering: zoomLevel >= 4 ? "pixelated" : "auto",
                }}
                className="absolute inset-0 flex items-center justify-center origin-center transition-transform duration-75"
              >
                <img
                  src={originalSrc}
                  alt="Original zoomed"
                  className="max-h-[500px] w-auto object-contain block pointer-events-none"
                />
              </div>

              {/* Scaled Compressed Image (Right Half) */}
              <div
                style={{
                  clipPath: `inset(0 0 0 ${sliderPos}%)`,
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                  imageRendering: zoomLevel >= 4 ? "pixelated" : "auto",
                }}
                className="absolute inset-0 flex items-center justify-center origin-center transition-transform duration-75"
              >
                <img
                  src={compressedSrc}
                  alt="Compressed zoomed"
                  className="max-h-[500px] w-auto object-contain block pointer-events-none"
                />
              </div>

              {/* Slider Divider Line */}
              <div
                style={{ left: `${sliderPos}%` }}
                className="absolute inset-y-0 w-0.5 bg-[var(--color-ink)] pointer-events-none z-20"
              >
                <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--color-paper)] border-2 border-[var(--color-ink)] flex items-center justify-center text-[10px] text-[var(--color-ink)] font-bold">
                  ⇄
                </div>
              </div>

              {/* Corner Stats */}
              <div className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-[var(--color-paper)] border border-[var(--color-rule)] text-xs text-[var(--color-muted)] z-10">
                Original: <span className="font-measured text-[var(--color-ink)] font-medium">{formatBytes(originalSize)}</span>
              </div>
              <div className="absolute top-4 right-4 px-2.5 py-1 rounded-md bg-[var(--color-paper)] border border-[var(--color-rule-2)] text-xs text-[var(--color-ink)] z-10">
                Compressed: <span className="font-measured font-medium">{formatBytes(compressedSize)}</span>
              </div>
            </div>
          ) : (
            /* Side-by-Side View */
            <div className="w-full h-full grid grid-cols-2 divide-x divide-[var(--color-rule)]">
              <div className="relative flex items-center justify-center overflow-hidden">
                <div className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-[var(--color-paper)] border border-[var(--color-rule)] text-xs text-[var(--color-muted)] z-10">
                  Original: <span className="font-measured text-[var(--color-ink)] font-medium">{formatBytes(originalSize)}</span>
                </div>
                <div
                  style={{
                    transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                    imageRendering: zoomLevel >= 4 ? "pixelated" : "auto",
                  }}
                  className="origin-center transition-transform duration-75"
                >
                  <img src={originalSrc} alt="Original" className="max-h-[350px] object-contain" />
                </div>
              </div>

              <div className="relative flex items-center justify-center overflow-hidden">
                <div className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-[var(--color-paper)] border border-[var(--color-rule-2)] text-xs text-[var(--color-ink)] z-10">
                  Compressed: <span className="font-measured font-medium">{formatBytes(compressedSize)}</span>
                </div>
                <div
                  style={{
                    transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                    imageRendering: zoomLevel >= 4 ? "pixelated" : "auto",
                  }}
                  className="origin-center transition-transform duration-75"
                >
                  <img src={compressedSrc} alt="Compressed" className="max-h-[350px] object-contain" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-5 py-2.5 border-t border-[var(--color-rule)] bg-[var(--color-paper-3)] flex items-center justify-between text-xs text-[var(--color-muted)]">
          <span className="flex items-center gap-1.5">
            <Move className="w-3.5 h-3.5 text-[var(--color-ink)]" />
            Drag to pan view, magnification: <span className="font-measured">{zoomLevel}</span>x
          </span>
          <span className="text-[11px]">
            {zoomLevel >= 4 ? "Pixel grid active (Nearest-Neighbor)" : "Bicubic Interpolation"}
          </span>
        </div>
      </div>
    </div>
  );
}
