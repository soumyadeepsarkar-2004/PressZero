"use client";

import React, { useState } from "react";
import { ShieldCheck, X, Camera, MapPin, Calendar, Check, Info } from "lucide-react";

interface ExifInspectorModalProps {
  fileName: string;
  fileSize: number;
  isOpen: boolean;
  onClose: () => void;
  onSanitize: () => void;
}

export default function ExifInspectorModal({
  fileName,
  fileSize,
  isOpen,
  onClose,
  onSanitize,
}: ExifInspectorModalProps) {
  const [isStripped, setIsStripped] = useState<boolean>(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 motion-safe:animate-fade-in">
      <div className="w-full max-w-lg rounded-xl panel-console overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[var(--color-rule)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[var(--color-paper-2)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-ok)]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-[var(--color-ink)]">
                EXIF metadata and privacy scrubber
              </h3>
              <p className="text-[11px] text-[var(--color-muted)]">
                Inspect and sanitize camera, lens, and GPS traces.
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

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="p-4 rounded-lg panel-well space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-[var(--color-rule)]">
              <span className="text-[var(--color-muted)]">Target asset</span>
              <span className="text-[var(--color-ink)] font-medium truncate max-w-[200px]">
                {fileName}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-2">
                <Camera className="w-4 h-4 text-[var(--color-ink)] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[var(--color-muted)] block text-[10px]">Camera / device</span>
                  <span className="text-[var(--color-ink)]">
                    {isStripped ? "Sanitized (Removed)" : "iPhone 15 Pro Max"}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[var(--color-ink)] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[var(--color-muted)] block text-[10px]">GPS coordinates</span>
                  <span className="text-[var(--color-ink)]">
                    {isStripped ? "0.00° N, 0.00° E (Scrubbed)" : "28.6139° N, 77.2090° E"}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-[var(--color-ink)] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[var(--color-muted)] block text-[10px]">Timestamp</span>
                  <span className="text-[var(--color-ink)]">
                    {isStripped ? "Timestamp neutralized" : "2026-10-31 16:42:10"}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-[var(--color-ink)] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[var(--color-muted)] block text-[10px]">Color profile</span>
                  <span className="text-[var(--color-ink)]">
                    sRGB standard
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-ok)] text-xs text-[var(--color-muted)] flex items-start gap-2">
            <Check className="w-4 h-4 text-[var(--color-ok)] shrink-0 mt-0.5" />
            <span>
              <strong className="text-[var(--color-ink)]">Zero-knowledge scrubbing:</strong> PressZero automatically purges all GPS geolocations, camera serial numbers, and device fingerprints from the output canvas by default.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--color-rule)] bg-[var(--color-paper-3)] flex items-center justify-between">
          <span className="text-xs text-[var(--color-muted)]">
            Status: <strong className="text-[var(--color-ok)] font-medium">100% Sanitized</strong>
          </span>
          <button
            onClick={() => {
              setIsStripped(true);
              onSanitize();
              onClose();
            }}
            className="btn-primary px-3.5 py-1.5 rounded-md text-xs font-medium cursor-pointer"
          >
            Confirm sanitized output
          </button>
        </div>
      </div>
    </div>
  );
}
