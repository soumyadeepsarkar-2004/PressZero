"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Upload, 
  Download, 
  Sparkles, 
  FileSignature, 
  UserCheck, 
  CheckCircle2, 
  Sliders, 
  RefreshCw, 
  ArrowRight,
  Crop,
  ZoomIn,
  ShieldCheck,
  Command
} from "lucide-react";
import confetti from "canvas-confetti";
import { compressToTargetKB, loadImage } from "@/lib/compression/engine";
import { formatBytes } from "@/lib/utils";
import { ImageFormat } from "@/types";
import { sanitizeFilename, validateFileInput } from "@/lib/security/sanitizer";
import CropModal from "@/components/studio/CropModal";
import PixelLoupeModal from "@/components/studio/PixelLoupeModal";
import ExifInspectorModal from "@/components/studio/ExifInspectorModal";
import { trackCompression, trackDownload } from "@/lib/telemetry";

export default function HeroMicroCompressor() {
  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null);
  const [originalName, setOriginalName] = useState<string>("sample_signature.jpg");
  const [originalSize, setOriginalSize] = useState<number>(343040); // 335 KB
  const [targetKB, setTargetKB] = useState<number>(30);
  const [format, setFormat] = useState<ImageFormat>("image/jpeg");
  const [signatureEnhance, setSignatureEnhance] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Result state
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [compressionRatio, setCompressionRatio] = useState<number>(0);
  const [timeMs, setTimeMs] = useState<number>(0);
  const [splitPos, setSplitPos] = useState<number>(50); // Split slider 0 - 100%

  // Modals state
  const [isCropOpen, setIsCropOpen] = useState<boolean>(false);
  const [isLoupeOpen, setIsLoupeOpen] = useState<boolean>(false);
  const [isExifOpen, setIsExifOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const isDraggingSplit = useRef<boolean>(false);
  const userInteracted = useRef<boolean>(false);

  // Helper to load realistic sample signature image
  const generateSampleSignature = useCallback(() => {
    const img = new Image();
    img.src = "/samples/signature_sample.jpg";
    img.onload = () => {
      setSourceImg(img);
      setOriginalName("Candidate_Signature.jpg");
      setOriginalSize(827747);
      setTargetKB(30);
      setSignatureEnhance(true);
    };
    img.onerror = () => {
      // Fallback canvas synthesis
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 250;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#f5f3ec";
      ctx.fillRect(0, 0, 600, 250);
      ctx.strokeStyle = "#1e3a8a";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(80, 150);
      ctx.bezierCurveTo(120, 40, 180, 220, 240, 120);
      ctx.stroke();
      const fallbackImg = new Image();
      fallbackImg.src = canvas.toDataURL("image/jpeg", 0.95);
      fallbackImg.onload = () => {
        setSourceImg(fallbackImg);
        setOriginalName("Candidate_Signature.jpg");
        setOriginalSize(343040);
        setTargetKB(30);
        setSignatureEnhance(true);
      };
    };
  }, []);

  // Helper to load realistic sample ID portrait
  const generateSampleIDPhoto = useCallback(() => {
    const img = new Image();
    img.src = "/samples/passport_sample.jpg";
    img.onload = () => {
      setSourceImg(img);
      setOriginalName("Passport_Photo_Raw.jpg");
      setOriginalSize(624115);
      setTargetKB(80);
      setSignatureEnhance(false);
    };
    img.onerror = () => {
      // Fallback canvas synthesis
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 750;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#cbd5e1";
      ctx.fillRect(0, 0, 600, 750);
      const fallbackImg = new Image();
      fallbackImg.src = canvas.toDataURL("image/jpeg", 0.95);
      fallbackImg.onload = () => {
        setSourceImg(fallbackImg);
        setOriginalName("Passport_Photo_Raw.jpg");
        setOriginalSize(624115);
        setTargetKB(80);
        setSignatureEnhance(false);
      };
    };
  }, []);

  // Run initial sample on load
  useEffect(() => {
    generateSampleSignature();
  }, [generateSampleSignature]);

  // Execute compression whenever image, target, or options change
  const runCompression = useCallback(async () => {
    if (!sourceImg) return;
    setIsProcessing(true);

    try {
      const res = await compressToTargetKB(sourceImg, {
        targetKB,
        format,
        allowScaling: true,
        signatureEnhance,
        signatureThreshold: 210,
      });

      setResultBlob(res.blob);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      const url = URL.createObjectURL(res.blob);
      setResultUrl(url);
      setResultSize(res.size);
      setTimeMs(res.timeMs);

      const ratio = Math.max(0, (1 - res.size / originalSize) * 100);
      setCompressionRatio(Math.round(ratio * 10) / 10);

      if (userInteracted.current) {
        trackCompression(res.timeMs);
      }
    } catch (err) {
      console.error("Micro compression failed:", err);
    } finally {
      setIsProcessing(false);
    }
  }, [sourceImg, targetKB, format, signatureEnhance, originalSize, resultUrl]);

  useEffect(() => {
    if (sourceImg) {
      runCompression();
    }
  }, [sourceImg, targetKB, format, signatureEnhance]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        setSplitPos((prev) => (prev > 50 ? 5 : 95));
      } else if (e.key === "d" || e.key === "D") {
        handleDownload();
      } else if (e.key === "c" || e.key === "C") {
        setIsCropOpen(true);
      } else if (e.key === "z" || e.key === "Z") {
        setIsLoupeOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resultBlob, originalName, targetKB, format]);

  // Handle file drop / upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFileInput(file);
    if (!validation.valid) {
      alert(validation.error || "Invalid file");
      return;
    }

    try {
      userInteracted.current = true;
      const img = await loadImage(file);
      const cleanName = sanitizeFilename(file.name);
      setSourceImg(img);
      setOriginalName(cleanName);
      setOriginalSize(file.size);
    } catch (err) {
      console.error("Error loading dropped file", err);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const validation = validateFileInput(file);
    if (!validation.valid) {
      alert(validation.error || "Invalid file");
      return;
    }

    try {
      userInteracted.current = true;
      const img = await loadImage(file);
      const cleanName = sanitizeFilename(file.name);
      setSourceImg(img);
      setOriginalName(cleanName);
      setOriginalSize(file.size);
    } catch (err) {
      console.error("Error loading dropped file", err);
    }
  };

  // Draggable comparison slider handlers
  const handleSplitMove = (clientX: number) => {
    if (!comparisonRef.current) return;
    const rect = comparisonRef.current.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSplitPos(Math.min(95, Math.max(5, pos)));
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    trackDownload();
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement("a");
    a.href = url;
    const ext = format === "image/webp" ? "webp" : format === "image/png" ? "png" : "jpg";
    const cleanName = sanitizeFilename(originalName);
    const lastDot = cleanName.lastIndexOf(".");
    const baseName = lastDot !== -1 ? cleanName.substring(0, lastDot) : cleanName;
    a.download = `${baseName}_${Math.round(targetKB)}KB.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ["#22d3ee", "#10b981", "#818cf8"],
      });
    } catch (e) {}
  };

  return (
    <>
      <div
        id="micro-compressor"
        className="w-full max-w-4xl mx-auto panel-console p-4 sm:p-6 lg:p-7 relative overflow-hidden"
      >
        {/* Precision Instrument Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[var(--color-rule)]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-xs text-[var(--color-ink)]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-ok)] motion-safe:animate-pulse" />
              <span className="font-medium">Web Worker Engine</span>
              <span className="text-[var(--color-muted)]">· Client RAM execution</span>
            </div>
            <span className="text-[11px] text-[var(--color-muted)] hidden md:inline">
              Dual-axis binary search (quality & downscaling)
            </span>
          </div>

          {/* Quick Actions & Testing Samples */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[var(--color-muted)] hidden xl:inline">Test files:</span>
            <button
              onClick={generateSampleSignature}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--color-paper-2)] hover:bg-[var(--color-surface-hover)] text-xs font-medium text-[var(--color-ink-2)] border border-[var(--color-rule)] transition-colors duration-150 active:scale-98 cursor-pointer"
            >
              <FileSignature className="w-3.5 h-3.5" />
              Signature (828KB)
            </button>
            <button
              onClick={generateSampleIDPhoto}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--color-paper-2)] hover:bg-[var(--color-surface-hover)] text-xs font-medium text-[var(--color-ink-2)] border border-[var(--color-rule)] transition-colors duration-150 active:scale-98 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              ID photo (624KB)
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--color-paper-3)] hover:bg-[var(--color-paper-2)] text-xs font-medium text-[var(--color-ink)] border border-[var(--color-rule-2)] transition-colors duration-150 active:scale-98 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Workbench Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
          {/* Left Canvas: Draggable Split Comparison Viewer (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
            <div
              ref={comparisonRef}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onMouseMove={(e) => {
                if (isDraggingSplit.current) handleSplitMove(e.clientX);
              }}
              onMouseUp={() => (isDraggingSplit.current = false)}
              onMouseLeave={() => (isDraggingSplit.current = false)}
              onTouchMove={(e) => handleSplitMove(e.touches[0].clientX)}
              className="relative w-full h-[340px] rounded-xl overflow-hidden panel-well select-none cursor-ew-resize group"
            >
              {/* Background Layer: Original Image */}
              {sourceImg && (
                <img
                  src={sourceImg.src}
                  alt="Original"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />
              )}

              {/* Foreground Layer: Compressed Result with Clip Path */}
              {resultUrl && (
                <div
                  style={{ clipPath: `inset(0 0 0 ${splitPos}%)` }}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                >
                  <img
                    src={resultUrl}
                    alt="Compressed"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Split Line Divider */}
              <div
                style={{ left: `${splitPos}%` }}
                onMouseDown={() => (isDraggingSplit.current = true)}
                className="absolute top-0 bottom-0 w-0.5 bg-[var(--color-ink)] cursor-ew-resize z-20"
              >
                <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--color-paper)] border-2 border-[var(--color-ink)] flex items-center justify-center text-[10px] text-[var(--color-ink)] font-bold shadow-md">
                  ⇄
                </div>
              </div>

              {/* Floating Readout Labels */}
              <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-[var(--color-paper)]/90 border border-[var(--color-rule)] text-[10px] sm:text-xs text-[var(--color-muted)] z-10">
                Original: <span className="font-measured text-[var(--color-ink)] font-medium">{formatBytes(originalSize)}</span>
              </div>

              <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-[var(--color-paper)]/90 border border-[var(--color-rule-2)] text-[10px] sm:text-xs text-[var(--color-ink)] z-10 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ok)] motion-safe:animate-pulse" />
                Compressed: <span className="font-measured font-medium">{resultSize ? formatBytes(resultSize) : "Computing..."}</span>
              </div>

              {/* Action Toolbar on Bottom Corner of Canvas */}
              <div 
                onMouseDown={(e) => e.stopPropagation()}
                className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 flex items-center gap-1.5 z-20"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCropOpen(true);
                  }}
                  className="px-2 sm:px-2.5 py-1 rounded-md bg-[var(--color-paper-2)] hover:bg-[var(--color-surface-hover)] text-[11px] sm:text-xs font-medium text-[var(--color-ink-2)] border border-[var(--color-rule)] flex items-center gap-1 transition-colors duration-150 cursor-pointer"
                  title="Focal Aspect Ratio Crop"
                >
                  <Crop className="w-3 h-3" />
                  <span>Crop</span>
                  <kbd className="hidden sm:inline text-[10px] text-[var(--color-muted)] ml-0.5">C</kbd>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLoupeOpen(true);
                  }}
                  className="px-2 sm:px-2.5 py-1 rounded-md bg-[var(--color-paper-2)] hover:bg-[var(--color-surface-hover)] text-[11px] sm:text-xs font-medium text-[var(--color-ink-2)] border border-[var(--color-rule)] flex items-center gap-1 transition-colors duration-150 cursor-pointer"
                  title="800% Pixel Inspection Loupe"
                >
                  <ZoomIn className="w-3 h-3" />
                  <span>Loupe</span>
                  <kbd className="hidden sm:inline text-[10px] text-[var(--color-muted)] ml-0.5">Z</kbd>
                </button>
              </div>

              {/* Bottom Drag Instruction */}
              <div className="absolute bottom-3 left-3 text-[10px] text-[var(--color-faint)] pointer-events-none hidden sm:block">
                Press <kbd className="px-1 rounded bg-[var(--color-paper-2)] text-[var(--color-muted)] border border-[var(--color-rule)]">Space</kbd> to toggle wipe
              </div>
            </div>

            {/* Metrics Bar */}
            <div className="flex items-center justify-between text-xs text-[var(--color-muted)] px-1">
              <span>
                Target limit: <strong className="text-[var(--color-ink)] font-medium"><span className="font-measured">{targetKB}</span> KB</strong>
              </span>
              <span className="text-[var(--color-ok)] font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Saved <span className="font-measured">{compressionRatio}</span>% in <span className="font-measured">{timeMs}</span>ms
              </span>
            </div>
          </div>

          {/* Right Controls: Exact Target KB Dial & Refined Parameters (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Target Size Dial Card */}
            <div className="p-4 rounded-xl panel-well space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[var(--color-ink)] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[var(--color-ink)]" />
                  Target size (exact KB)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="2"
                    max="5000"
                    value={targetKB}
                    onChange={(e) => setTargetKB(Math.max(1, Number(e.target.value)))}
                    className="w-16 px-2 py-0.5 rounded-md bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[var(--color-ink)] text-xs font-bold text-center font-measured focus:border-[var(--color-ink)] focus:outline-none"
                  />
                  <span className="text-xs text-[var(--color-muted)] font-medium">KB</span>
                </div>
              </div>

              {/* Slider with Portal Ticks */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="2"
                  max="250"
                  value={targetKB}
                  onChange={(e) => setTargetKB(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[var(--color-faint)] font-measured">
                  <span>2KB</span>
                  <span>15KB</span>
                  <span>30KB</span>
                  <span>50KB</span>
                  <span>100KB</span>
                  <span>250KB</span>
                </div>
              </div>

              {/* Portal Target Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { label: "4 KB", val: 4, hint: "Micro" },
                  { label: "15 KB", val: 15, hint: "UPSC Sign" },
                  { label: "30 KB", val: 30, hint: "NTA Sign" },
                  { label: "50 KB", val: 50, hint: "NTA Photo" },
                  { label: "100 KB", val: 100, hint: "Web LCP" },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setTargetKB(item.val)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-150 cursor-pointer ${
                      targetKB === item.val
                        ? "bg-[var(--color-ink)] text-[var(--color-accent-ink)] font-semibold shadow-sm"
                        : "bg-[var(--color-paper-2)] text-[var(--color-muted)] hover:text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-rule-2)]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Format & Signature Enhancement Settings */}
            <div className="p-4 rounded-xl panel-well space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--color-ink-2)]">Target codec</span>
                <div className="flex items-center gap-1 bg-[var(--color-paper-2)] p-1 rounded-lg border border-[var(--color-rule)] text-xs">
                  {(["image/jpeg", "image/webp", "image/png"] as ImageFormat[]).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setFormat(fmt)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-150 cursor-pointer ${
                        format === fmt
                          ? "bg-[var(--color-paper-3)] text-[var(--color-ink)] border border-[var(--color-rule-2)]"
                          : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                      }`}
                    >
                      {fmt === "image/jpeg" ? "JPG" : fmt === "image/webp" ? "WEBP" : "PNG"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Signature Crisp Toggle */}
              <div className="pt-2 border-t border-[var(--color-rule)] flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-[var(--color-ink)] block">
                    Signature crisp filter
                  </span>
                  <span className="text-[10px] text-[var(--color-muted)] block">
                    Adaptive white bleach and ink enhancer
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSignatureEnhance(!signatureEnhance)}
                  className={`w-10 h-5 rounded-full transition-colors duration-150 relative cursor-pointer ${
                    signatureEnhance ? "bg-[var(--color-ink)]" : "bg-[var(--color-rule)]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-[var(--color-paper)] transition-transform duration-150 ${
                      signatureEnhance ? "left-5.5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* EXIF Scrubber Status */}
              <div className="pt-2 border-t border-[var(--color-rule)] flex items-center justify-between text-xs">
                <span className="text-[var(--color-muted)] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-ok)]" />
                  GPS and EXIF scrubber
                </span>
                <button
                  onClick={() => setIsExifOpen(true)}
                  className="text-xs text-[var(--color-ink)] hover:underline cursor-pointer"
                >
                  Inspect
                </button>
              </div>
            </div>

            {/* Instant Download Action */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleDownload}
                disabled={isProcessing || !resultBlob}
                className="w-full py-3 px-4 rounded-md text-xs font-medium btn-primary flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Save {resultSize ? formatBytes(resultSize) : "Output"}</span>
                <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-paper-2)] text-[var(--color-accent-ink)] text-[10px]">
                  D
                </kbd>
              </button>

              <a
                href="#studio"
                className="w-full py-1.5 text-center text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] flex items-center justify-center gap-1 transition-colors duration-150 group"
              >
                <span>Batch processing and portal matrix below</span>
                <ArrowRight className="w-3.5 h-3.5 motion-safe:group-hover:translate-x-0.5 motion-safe:transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {sourceImg && (
        <CropModal
          image={sourceImg}
          isOpen={isCropOpen}
          onClose={() => setIsCropOpen(false)}
          onApplyCrop={(croppedImg) => {
            setSourceImg(croppedImg);
            setIsCropOpen(false);
          }}
        />
      )}

      {sourceImg && resultUrl && (
        <PixelLoupeModal
          originalSrc={sourceImg.src}
          originalSize={originalSize}
          compressedSrc={resultUrl}
          compressedSize={resultSize || 0}
          isOpen={isLoupeOpen}
          onClose={() => setIsLoupeOpen(false)}
        />
      )}

      <ExifInspectorModal
        fileName={originalName}
        fileSize={originalSize}
        isOpen={isExifOpen}
        onClose={() => setIsExifOpen(false)}
        onSanitize={() => setIsExifOpen(false)}
      />
    </>
  );
}
