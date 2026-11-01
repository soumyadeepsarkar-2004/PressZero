"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Upload, 
  Download, 
  Trash2, 
  Sliders, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  FileArchive, 
  RefreshCw, 
  Crop,
  ZoomIn,
  Check,
  FileCheck,
  Play,
  HelpCircle
} from "lucide-react";
import JSZip from "jszip";
import confetti from "canvas-confetti";
import { PORTAL_PRESETS } from "@/lib/presets/portalMatrix";
import { compressToTargetKB, loadImage } from "@/lib/compression/engine";
import { formatBytes } from "@/lib/utils";
import { CompressionJob, ImageFormat, PortalPreset } from "@/types";
import { sanitizeFilename, MAX_QUEUE_SIZE, validateFileInput } from "@/lib/security/sanitizer";
import CropModal from "@/components/studio/CropModal";
import PixelLoupeModal from "@/components/studio/PixelLoupeModal";
import VideoDemoModal, { VideoTopic } from "@/components/common/VideoDemoModal";
import { trackCompression, trackDownload } from "@/lib/telemetry";

interface StudioWorkspaceProps {
  selectedPresetId?: string;
  selectedFeature?: string;
}

export default function StudioWorkspace({ selectedPresetId, selectedFeature }: StudioWorkspaceProps) {
  const [jobs, setJobs] = useState<CompressionJob[]>([]);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  
  // Studio settings
  const [targetKB, setTargetKB] = useState<number>(30);
  const [format, setFormat] = useState<ImageFormat>("image/jpeg");
  const [allowScaling, setAllowScaling] = useState<boolean>(true);
  const [signatureEnhance, setSignatureEnhance] = useState<boolean>(false);
  const [signatureThreshold, setSignatureThreshold] = useState<number>(210);
  const [activePreset, setActivePreset] = useState<PortalPreset | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [cropJob, setCropJob] = useState<CompressionJob | null>(null);
  const [cropImageElement, setCropImageElement] = useState<HTMLImageElement | null>(null);
  const [loupeJob, setLoupeJob] = useState<CompressionJob | null>(null);
  const [showStudioGuide, setShowStudioGuide] = useState<boolean>(false);
  const [studioVideoTopic, setStudioVideoTopic] = useState<VideoTopic | null>(null);
  const [isMac, setIsMac] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const featureAppliedRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent || ""));
    }
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // Apply preset if selected
  const applyPreset = useCallback((preset: PortalPreset) => {
    setActivePreset(preset);
    setTargetKB(preset.targetKB);
    setFormat(preset.format);
    if (preset.requiresSignatureEnhance !== undefined) {
      setSignatureEnhance(preset.requiresSignatureEnhance);
    }
    showToast(`Calibrated to ${preset.name} (${preset.targetKB} KB)`);
  }, []);

  useEffect(() => {
    if (selectedPresetId) {
      const match = PORTAL_PRESETS.find((p) => p.id === selectedPresetId);
      if (match) applyPreset(match);
    }
  }, [selectedPresetId, applyPreset]);

  // Clipboard paste support (Ctrl+V anywhere)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            addFilesToQueue([file]);
            showToast("Imported clipboard buffer");
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [targetKB, format, allowScaling, signatureEnhance, signatureThreshold]);

  // Process a batch of jobs
  const processQueue = useCallback(async (jobsToProcess: CompressionJob[]) => {
    for (const job of jobsToProcess) {
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, status: "processing" } : j))
      );

      try {
        const img = await loadImage(job.file);
        const res = await compressToTargetKB(img, {
          targetKB: job.targetKB,
          format: job.format,
          allowScaling: job.allowScaling,
          signatureEnhance: job.signatureEnhance,
          signatureThreshold: job.signatureThreshold,
        });

        const resultUrl = URL.createObjectURL(res.blob);
        const ratio = Math.max(0, (1 - res.size / job.originalSize) * 100);

        trackCompression(res.timeMs);

        setJobs((prev) =>
          prev.map((j) =>
            j.id === job.id
              ? {
                  ...j,
                  status: "completed",
                  resultBlob: res.blob,
                  resultUrl,
                  resultSize: res.size,
                  resultWidth: res.width,
                  resultHeight: res.height,
                  quality: res.quality,
                  compressionRatio: Math.round(ratio * 10) / 10,
                  processingTimeMs: res.timeMs,
                }
              : j
          )
        );
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Compression error";

        setJobs((prev) =>
          prev.map((j) =>
            j.id === job.id
              ? {
                  ...j,
                  status: "error",
                  errorMessage: message,
                }
              : j
          )
        );
      }
    }
  }, []);

  // Add files to processing queue
  const addFilesToQueue = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    // Boundary check: Enforce maximum queue ceiling
    if (jobs.length >= MAX_QUEUE_SIZE) {
      showToast(`Queue limit: Maximum ${MAX_QUEUE_SIZE} files allowed simultaneously.`);
      return;
    }

    const availableSlots = MAX_QUEUE_SIZE - jobs.length;
    const filesToProcess = files.slice(0, availableSlots);
    if (files.length > availableSlots) {
      showToast(`Batch trimmed: Queue capped at ${MAX_QUEUE_SIZE} files.`);
    }

    const newJobs: CompressionJob[] = [];

    for (const file of filesToProcess) {
      const validation = validateFileInput(file);
      if (!validation.valid) {
        showToast(validation.error || "Invalid file rejected.");
        continue;
      }

      try {
        const img = await loadImage(file);
        const jobId = Math.random().toString(36).substring(2, 9);
        const cleanName = sanitizeFilename(file.name);

        const job: CompressionJob = {
          id: jobId,
          file,
          name: cleanName,
          originalSize: file.size,
          originalWidth: img.naturalWidth || img.width,
          originalHeight: img.naturalHeight || img.height,
          previewUrl: URL.createObjectURL(file),
          status: "idle",
          targetKB,
          format,
          quality: 0.8,
          allowScaling,
          signatureEnhance,
          signatureThreshold,
        };

        newJobs.push(job);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to load image";
        showToast(msg);
      }
    }

    if (newJobs.length > 0) {
      setJobs((prev) => [...prev, ...newJobs]);
      setActiveJobId((prevActive) => prevActive || newJobs[0].id);
      processQueue(newJobs);
    }
  }, [jobs.length, targetKB, format, allowScaling, signatureEnhance, signatureThreshold, processQueue, showToast]);

  // Generate sample batch using authentic generated assets
  const loadSampleBatch = useCallback(async () => {
    try {
      const [signRes, photoRes, docRes] = await Promise.all([
        fetch("/samples/signature_sample.jpg"),
        fetch("/samples/passport_sample.jpg"),
        fetch("/samples/document_sample.jpg"),
      ]);

      if (signRes.ok && photoRes.ok && docRes.ok) {
        const [signBlob, photoBlob, docBlob] = await Promise.all([
          signRes.blob(),
          photoRes.blob(),
          docRes.blob(),
        ]);

        const signFile = new File([signBlob], "Candidate_Signature_Bleached.jpg", { type: "image/jpeg" });
        const photoFile = new File([photoBlob], "Biometric_Passport_Photo.jpg", { type: "image/jpeg" });
        const docFile = new File([docBlob], "Official_Certificate_Document.jpg", { type: "image/jpeg" });

        await addFilesToQueue([signFile, photoFile, docFile]);
        showToast("Loaded 3 authentic generated sample assets");
        return;
      }
    } catch {
      // Fallback to canvas synthesis if fetch fails
    }

    // Canvas fallback
    const signCanvas = document.createElement("canvas");
    signCanvas.width = 700;
    signCanvas.height = 300;
    const signCtx = signCanvas.getContext("2d");
    if (signCtx) {
      signCtx.fillStyle = "#f1ece4";
      signCtx.fillRect(0, 0, 700, 300);
      signCtx.strokeStyle = "#1b2838";
      signCtx.lineWidth = 4;
      signCtx.beginPath();
      signCtx.moveTo(80, 160);
      signCtx.bezierCurveTo(140, 70, 210, 240, 280, 140);
      signCtx.bezierCurveTo(340, 80, 400, 230, 480, 150);
      signCtx.lineTo(620, 150);
      signCtx.stroke();
      signCanvas.toBlob((blob) => {
        if (!blob) return;
        const signFile = new File([blob], "NTA_Candidate_Signature.jpg", { type: "image/jpeg" });

        const photoCanvas = document.createElement("canvas");
        photoCanvas.width = 600;
        photoCanvas.height = 750;
        const photoCtx = photoCanvas.getContext("2d");
        if (photoCtx) {
          photoCtx.fillStyle = "#cbd5e1";
          photoCtx.fillRect(0, 0, 600, 750);
          photoCtx.fillStyle = "#1e293b";
          photoCtx.beginPath();
          photoCtx.ellipse(300, 720, 240, 180, 0, 0, Math.PI * 2);
          photoCtx.fill();
          photoCtx.fillStyle = "#f8fafc";
          photoCtx.beginPath();
          photoCtx.ellipse(300, 320, 140, 180, 0, 0, Math.PI * 2);
          photoCtx.fill();
          photoCanvas.toBlob((photoBlob) => {
            if (!photoBlob) return;
            const photoFile = new File([photoBlob], "UPSC_Passport_Photo.jpg", { type: "image/jpeg" });
            addFilesToQueue([signFile, photoFile]);
            showToast("Loaded sample test batch");
          }, "image/jpeg", 0.95);
        }
      }, "image/jpeg", 0.95);
    }
  }, [addFilesToQueue, showToast]);

  // Deep-link capability handler (?feature=exact-kb | bleach | crop | batch)
  useEffect(() => {
    if (!selectedFeature || featureAppliedRef.current) return;
    featureAppliedRef.current = true;

    if (selectedFeature === "bleach") {
      setSignatureEnhance(true);
      setTargetKB(20);
      showToast("Activated Signature Bleach Engine (Pure 255 White Background)");
      loadSampleBatch();
    } else if (selectedFeature === "crop") {
      showToast("Biometric Aspect Cropper: Select an item and click 'Crop' to format");
      loadSampleBatch();
    } else if (selectedFeature === "exact-kb") {
      setTargetKB(50);
      showToast("Target-Exact Bisection Engine: Calibrated to 50 KB ceiling");
      loadSampleBatch();
    } else if (selectedFeature === "batch") {
      showToast("Batch Queue Engine: Multi-threaded local pipeline ready");
      loadSampleBatch();
    }
  }, [selectedFeature, loadSampleBatch, showToast]);

  // Download single image
  const handleDownloadSingle = (job: CompressionJob) => {
    if (!job.resultBlob) return;
    trackDownload();
    const url = URL.createObjectURL(job.resultBlob);
    const a = document.createElement("a");
    a.href = url;
    const ext = job.format === "image/webp" ? "webp" : job.format === "image/png" ? "png" : "jpg";
    const cleanName = sanitizeFilename(job.name);
    const lastDot = cleanName.lastIndexOf(".");
    const base = lastDot !== -1 ? cleanName.substring(0, lastDot) : cleanName;
    a.download = `${base}_${job.targetKB}KB.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast(`Exported ${cleanName}`);
  };

  // Download all completed jobs as ZIP
  const handleDownloadZip = async () => {
    const completedJobs = jobs.filter((j) => j.status === "completed" && j.resultBlob);
    if (completedJobs.length === 0) return;
    trackDownload();

    const zip = new JSZip();
    completedJobs.forEach((job) => {
      const ext = job.format === "image/webp" ? "webp" : job.format === "image/png" ? "png" : "jpg";
      const cleanName = sanitizeFilename(job.name);
      const lastDot = cleanName.lastIndexOf(".");
      const base = lastDot !== -1 ? cleanName.substring(0, lastDot) : cleanName;
      zip.file(`${base}_${job.targetKB}KB.${ext}`, job.resultBlob!);
    });

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PressZero_Batch_${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    showToast("Batch archive ready");
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch {}
  };

  const removeJob = (id: string) => {
    const jobToRemove = jobs.find((j) => j.id === id);
    if (jobToRemove) {
      if (jobToRemove.previewUrl) URL.revokeObjectURL(jobToRemove.previewUrl);
      if (jobToRemove.resultUrl) URL.revokeObjectURL(jobToRemove.resultUrl);
    }
    setJobs((prev) => prev.filter((j) => j.id !== id));
    if (activeJobId === id) setActiveJobId(null);
  };

  const clearAllJobs = () => {
    jobs.forEach((j) => {
      if (j.previewUrl) URL.revokeObjectURL(j.previewUrl);
      if (j.resultUrl) URL.revokeObjectURL(j.resultUrl);
    });
    setJobs([]);
    setActiveJobId(null);
  };

  // Trigger Crop for a specific job
  const handleOpenCrop = async (job: CompressionJob) => {
    try {
      const img = await loadImage(job.file);
      setCropJob(job);
      setCropImageElement(img);
    } catch (e) {
      console.error("Could not load image for crop", e);
    }
  };

  // Apply crop result to a job
  const handleApplyCrop = async (croppedImg: HTMLImageElement) => {
    if (!cropJob) return;

    const canvas = document.createElement("canvas");
    canvas.width = croppedImg.naturalWidth || croppedImg.width;
    canvas.height = croppedImg.naturalHeight || croppedImg.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(croppedImg, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const updatedFile = new File([blob], cropJob.name, { type: cropJob.file.type });

      const res = await compressToTargetKB(croppedImg, {
        targetKB: cropJob.targetKB,
        format: cropJob.format,
        allowScaling: cropJob.allowScaling,
        signatureEnhance: cropJob.signatureEnhance,
        signatureThreshold: cropJob.signatureThreshold,
      });

      const resultUrl = URL.createObjectURL(res.blob);
      const ratio = Math.max(0, (1 - res.size / blob.size) * 100);

      setJobs((prev) =>
        prev.map((j) =>
          j.id === cropJob.id
            ? {
                ...j,
                file: updatedFile,
                previewUrl: URL.createObjectURL(blob),
                originalSize: blob.size,
                originalWidth: canvas.width,
                originalHeight: canvas.height,
                status: "completed",
                resultBlob: res.blob,
                resultUrl,
                resultSize: res.size,
                resultWidth: res.width,
                resultHeight: res.height,
                quality: res.quality,
                compressionRatio: Math.round(ratio * 10) / 10,
                processingTimeMs: res.timeMs,
              }
            : j
        )
      );

      setCropJob(null);
      setCropImageElement(null);
      showToast(`Recalibrated ${cropJob.name}`);
    }, cropJob.file.type);
  };

  return (
    <section id="studio" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[var(--color-rule)]">
      {/* Toast Notification Pill */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-3.5 py-2 rounded-md panel-console text-xs font-medium text-[var(--color-ink)] shadow-2xl motion-safe:animate-fade-in">
          <Check className="w-3.5 h-3.5 text-[var(--color-ok)]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Studio Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[var(--color-ink)]">
              Studio workbench
            </span>
            <span className="text-xs text-[var(--color-ok)] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Zero server storage
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
            Batch reducer and precision studio
          </h2>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Drop multiple assets or paste from clipboard with <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-paper-2)] text-[10px] text-[var(--color-muted)] border border-[var(--color-rule)]">{isMac ? "⌘V" : "Ctrl+V"}</kbd>.
          </p>
        </div>

        {/* Global Action & Guide Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={loadSampleBatch}
            className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[var(--color-ink)] border border-[var(--color-rule)] cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load sample batch</span>
          </button>

          <button
            onClick={() => setShowStudioGuide(!showStudioGuide)}
            className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] border border-[var(--color-rule)] cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showStudioGuide ? "Hide guide" : "Quick guide"}</span>
          </button>

          {jobs.length > 0 && (
            <>
              <button
                onClick={handleDownloadZip}
                className="btn-primary flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
              >
                <FileArchive className="w-3.5 h-3.5" />
                <span>Download ZIP ({jobs.filter((j) => j.status === "completed").length})</span>
              </button>
              <button
                onClick={clearAllJobs}
                className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-[var(--color-muted)] hover:text-red-400 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear queue</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Expandable Studio Quick Video Guide */}
      {showStudioGuide && (
        <div className="mb-6 p-4 sm:p-5 rounded-xl panel-console border border-[var(--color-rule-2)] space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-[var(--color-ink)] flex items-center gap-2">
              <Play className="w-3.5 h-3.5 text-[var(--color-ok)]" />
              Studio workbench visual tour and shortcuts
            </h3>
            <a
              href="#product-tour"
              className="text-[11px] text-[var(--color-muted)] hover:text-[var(--color-ink)] flex items-center gap-1"
            >
              <span>Watch full video tour</span>
              <Play className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--color-ink)]">1. Biometric cropper</span>
                <kbd className="px-1.5 py-0.2 rounded bg-[var(--color-paper-3)] border border-[var(--color-rule)] text-[10px] text-[var(--color-muted)]">C</kbd>
              </div>
              <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
                Click Crop or press C on any active job to lock 7:3 signature, 7:9 passport, or 1:1 visa aspect ratios.
              </p>
              <button
                onClick={() => setStudioVideoTopic("cropper")}
                className="text-[10px] text-[var(--color-ink)] hover:underline flex items-center gap-1 pt-1 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
              >
                <Play className="w-2.5 h-2.5 text-[var(--color-ok)]" />
                <span>Watch cropper video</span>
              </button>
            </div>

            <div className="p-3 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--color-ink)]">2. 800% Pixel loupe</span>
                <kbd className="px-1.5 py-0.2 rounded bg-[var(--color-paper-3)] border border-[var(--color-rule)] text-[10px] text-[var(--color-muted)]">Z</kbd>
              </div>
              <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
                Click Loupe or press Z to inspect nearest-neighbor pixel blocks, ringing artifacts, and pen strokes.
              </p>
              <button
                onClick={() => setStudioVideoTopic("loupe")}
                className="text-[10px] text-[var(--color-ink)] hover:underline flex items-center gap-1 pt-1 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
              >
                <Play className="w-2.5 h-2.5 text-[var(--color-ok)]" />
                <span>Watch loupe video</span>
              </button>
            </div>

            <div className="p-3 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--color-ink)]">3. Signature bleach</span>
                <span className="text-[10px] text-[var(--color-ok)] font-medium">Auto</span>
              </div>
              <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
                Toggle signature enhancement to strip dirty scanner shadows, leveling paper background to pure white.
              </p>
              <button
                onClick={() => setStudioVideoTopic("bleach")}
                className="text-[10px] text-[var(--color-ink)] hover:underline flex items-center gap-1 pt-1 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
              >
                <Play className="w-2.5 h-2.5 text-[var(--color-ok)]" />
                <span>Watch bleach video</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preset Bank */}
      <div className="mb-6 p-4 rounded-xl panel-console space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-[var(--color-ink)] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-ink)]" />
            Calibration presets
          </span>
          {activePreset && (
            <span className="text-[var(--color-muted)]">
              Active: <strong className="text-[var(--color-ink)]">{activePreset.name}</strong> ({activePreset.targetKB} KB)
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {PORTAL_PRESETS.map((preset) => {
            const isSelected = activePreset?.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={`px-3 py-1.5 rounded-md text-xs transition-colors duration-150 flex items-center gap-2 border cursor-pointer ${
                  isSelected
                    ? "bg-[var(--color-paper-2)] border-[var(--color-ink)] text-[var(--color-ink)] font-medium"
                    : "bg-[var(--color-paper)] border-[var(--color-rule)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:border-[var(--color-rule-2)]"
                }`}
              >
                <span>{preset.name}</span>
                <span className="px-1.5 py-0.2 rounded bg-[var(--color-paper-3)] text-[11px] text-[var(--color-ink)]">
                  <span className="font-measured">{preset.targetKB}</span> KB
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Well & Telemetry Dial (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files) {
                addFilesToQueue(Array.from(e.dataTransfer.files));
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className="p-8 rounded-xl panel-well border-dashed border-[var(--color-rule)] hover:border-[var(--color-rule-hover)] text-center cursor-pointer flex flex-col items-center justify-center space-y-2.5 transition-colors duration-150 group"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-ink)] group-hover:border-[var(--color-ink)] transition-colors duration-150">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-ink)]">
                Drop images to process
              </p>
              <p className="text-xs text-[var(--color-muted)] mt-0.5">
                or click to browse local files
              </p>
            </div>
            <div className="text-[11px] text-[var(--color-muted)]">
              JPEG, PNG, WebP · client-side only
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) addFilesToQueue(Array.from(e.target.files));
              }}
            />
          </div>

          {/* Instrument Parameters */}
          <div className="p-5 rounded-xl panel-console space-y-4">
            <h3 className="text-xs font-semibold tracking-wide text-[var(--color-ink)] flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-[var(--color-ink)]" />
              Target configuration
            </h3>

            {/* Target KB Dial */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="text-[var(--color-muted)]">
                  Maximum file weight
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={targetKB}
                    onChange={(e) => setTargetKB(Math.max(1, Number(e.target.value)))}
                    className="w-16 px-2 py-0.5 rounded bg-[var(--color-paper-3)] border border-[var(--color-rule)] text-[var(--color-ink)] text-xs font-measured text-center focus:border-[var(--color-ink)] focus:outline-none"
                  />
                  <span className="text-[var(--color-muted)] font-medium">KB</span>
                </div>
              </div>
              <input
                type="range"
                min="2"
                max="300"
                value={targetKB}
                onChange={(e) => setTargetKB(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[var(--color-muted)]">
                <span>2 KB</span>
                <span>50 KB</span>
                <span>100 KB</span>
                <span>300 KB</span>
              </div>
            </div>

            {/* Format Selector */}
            <div className="space-y-2 pt-2 border-t border-[var(--color-rule)]">
              <label className="text-xs text-[var(--color-muted)]">
                Encoding format
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "image/jpeg", label: "JPG" },
                  { id: "image/webp", label: "WebP" },
                  { id: "image/png", label: "PNG" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFormat(item.id as ImageFormat)}
                    className={`py-1.5 px-2 rounded-md text-xs transition-colors duration-150 text-center border cursor-pointer ${
                      format === item.id
                        ? "bg-[var(--color-paper-2)] border-[var(--color-ink)] text-[var(--color-ink)] font-medium"
                        : "bg-[var(--color-paper)] border-[var(--color-rule)] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Signature Crisp Toggle */}
            <div className="pt-2 border-t border-[var(--color-rule)] space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-[var(--color-ink)] block">
                    Signature ink booster
                  </span>
                  <span className="text-[10px] text-[var(--color-muted)] block">
                    Adaptive background bleach for signatures
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSignatureEnhance(!signatureEnhance)}
                  className={`w-9 h-5 rounded-full transition-colors duration-150 relative cursor-pointer ${
                    signatureEnhance ? "bg-[var(--color-ink)]" : "bg-[var(--color-paper-3)] border border-[var(--color-rule)]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-[var(--color-paper)] transition-transform duration-150 ${
                      signatureEnhance ? "left-4.5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              {signatureEnhance && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-xs text-[var(--color-muted)]">
                    <span>Bleach threshold</span>
                    <span className="font-measured text-[var(--color-ink)]">{signatureThreshold}</span>
                  </div>
                  <input
                    type="range"
                    min="160"
                    max="245"
                    value={signatureThreshold}
                    onChange={(e) => setSignatureThreshold(Number(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Reapply button */}
            {jobs.length > 0 && (
              <button
                disabled={jobs.length === 0}
                onClick={() => processQueue(jobs)}
                className="w-full py-2 rounded-md font-medium text-xs btn-ghost border border-[var(--color-rule)] text-[var(--color-ink)] flex items-center justify-center gap-2 transition-colors duration-150 active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-calibrate queue ({jobs.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: High-Density Jobs Table & Utilities (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-xl panel-console overflow-hidden">
            <div className="p-3.5 px-4 border-b border-[var(--color-rule)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[var(--color-ink)]" />
                <h3 className="text-xs font-semibold text-[var(--color-ink)]">Queue register</h3>
                <span className="px-2 py-0.2 rounded text-[11px] bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[var(--color-muted)]">
                  <span className="font-measured">{jobs.length}</span> items
                </span>
              </div>
            </div>

            {jobs.length === 0 ? (
              <div className="py-14 px-4 text-center text-xs space-y-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] mx-auto flex items-center justify-center text-[var(--color-muted)]">
                  <FileCheck className="w-5 h-5 text-[var(--color-rule-2)]" />
                </div>
                <div className="max-w-sm mx-auto space-y-1">
                  <p className="font-semibold text-sm text-[var(--color-ink)]">Queue is ready for batch processing</p>
                  <p className="text-[var(--color-muted)] text-xs leading-relaxed">
                    Drop photos on the left, paste with <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[var(--color-muted)]">{isMac ? "⌘V" : "Ctrl+V"}</kbd>, or try with instant sample files.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <button
                    onClick={loadSampleBatch}
                    className="btn-primary px-3.5 py-1.5 text-xs font-medium flex items-center gap-1.5 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Load sample test batch</span>
                  </button>
                  <a
                    href="#product-tour"
                    className="btn-ghost px-3.5 py-1.5 text-xs font-medium flex items-center gap-1.5 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Watch video tour</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-[var(--color-rule)]">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-3.5 sm:px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-[var(--color-surface-hover)] transition-colors"
                  >
                    {/* Thumbnail & File Name */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-md bg-[var(--color-paper-3)] overflow-hidden border border-[var(--color-rule)] shrink-0">
                        <img
                          src={job.resultUrl || job.previewUrl}
                          alt={job.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[var(--color-ink)] truncate max-w-[200px] sm:max-w-[280px]">
                          {job.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-[var(--color-muted)] mt-0.5">
                          <span className="font-measured">{formatBytes(job.originalSize)}</span>
                          <span>→</span>
                          {job.resultSize ? (
                            <span className="font-measured text-[var(--color-ok)] font-medium">
                              {formatBytes(job.resultSize)}
                            </span>
                          ) : (
                            <span className="text-[var(--color-muted)]">Processing…</span>
                          )}
                          {job.compressionRatio ? (
                            <span className="font-measured text-[var(--color-ink)]">
                              (-{job.compressionRatio}%)
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {/* Pro Tool Actions */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleOpenCrop(job)}
                        className="px-2.5 py-1 rounded-md bg-[var(--color-paper)] hover:bg-[var(--color-paper-2)] text-[var(--color-muted)] hover:text-[var(--color-ink)] border border-[var(--color-rule)] transition-colors duration-150 flex items-center gap-1 text-xs cursor-pointer"
                        title="Crop to focal ratio"
                      >
                        <Crop className="w-3 h-3 text-[var(--color-ink)]" />
                        <span>Crop</span>
                      </button>

                      {job.status === "completed" && job.resultUrl && (
                        <>
                          <button
                            onClick={() => setLoupeJob(job)}
                            className="p-1.5 rounded-md bg-[var(--color-paper)] hover:bg-[var(--color-paper-2)] text-[var(--color-muted)] hover:text-[var(--color-ink)] border border-[var(--color-rule)] transition-colors duration-150 cursor-pointer"
                            title="800% pixel inspection loupe"
                          >
                            <ZoomIn className="w-3.5 h-3.5 text-[var(--color-ink)]" />
                          </button>
                          <button
                            onClick={() => handleDownloadSingle(job)}
                            className="btn-primary flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium cursor-pointer active:scale-98"
                          >
                            <Download className="w-3 h-3" />
                            <span>Save</span>
                          </button>
                        </>
                      )}

                      {job.status === "processing" && (
                        <span className="text-xs text-[var(--color-ink)] flex items-center gap-1 motion-safe:animate-pulse">
                          <RefreshCw className="w-3.5 h-3.5 motion-safe:animate-spin" />
                          Running…
                        </span>
                      )}

                      <button
                        onClick={() => removeJob(job.id)}
                        className="p-1.5 rounded-md text-[var(--color-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors duration-150 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {cropImageElement && cropJob && (
        <CropModal
          image={cropImageElement}
          isOpen={!!cropJob}
          onClose={() => {
            setCropJob(null);
            setCropImageElement(null);
          }}
          onApplyCrop={handleApplyCrop}
        />
      )}

      {loupeJob && loupeJob.resultUrl && (
        <PixelLoupeModal
          originalSrc={loupeJob.previewUrl}
          originalSize={loupeJob.originalSize}
          compressedSrc={loupeJob.resultUrl}
          compressedSize={loupeJob.resultSize || 0}
          isOpen={!!loupeJob}
          onClose={() => setLoupeJob(null)}
        />
      )}

      {/* Video Demonstration Modal */}
      {studioVideoTopic && (
        <VideoDemoModal
          isOpen={true}
          onClose={() => setStudioVideoTopic(null)}
          topic={studioVideoTopic}
        />
      )}
    </section>
  );
}
