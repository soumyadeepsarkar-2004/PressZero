"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  FileSignature, 
  ShieldCheck, 
  FileArchive, 
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Activity,
  Layers,
  ZoomIn,
  Eye,
  Check
} from "lucide-react";

interface Chapter {
  id: string;
  title: string;
  duration: number; // in seconds
  description: string;
  icon: React.ReactNode;
  initialSize: string;
  targetSize: string;
  badge: string;
  actionText: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: "exact-dial",
    title: "1. Exact Kilobyte Bisection",
    duration: 6,
    description: "Watch dual-axis binary search bisect image quality to hit exact byte ceilings (e.g. 20 KB limit) in under 25ms.",
    icon: <Sliders className="w-4 h-4" aria-hidden="true" />,
    initialSize: "2.84 MB",
    targetSize: "19.8 KB",
    badge: "99.3% reduction",
    actionText: "Calibrating bisection step 4 of 8...",
  },
  {
    id: "signature-bleach",
    title: "2. Signature Ink Bleach",
    duration: 6,
    description: "Adaptive thresholding strips smartphone desk shadows and yellow tint, locking paper to pure white and boosting pen strokes.",
    icon: <FileSignature className="w-4 h-4" aria-hidden="true" />,
    initialSize: "480 KB",
    targetSize: "14.2 KB",
    badge: "Zero desk shadow",
    actionText: "Applying adaptive white point cutoff (threshold: 210)...",
  },
  {
    id: "exam-portals",
    title: "3. Exam Portal Compliance",
    duration: 6,
    description: "One click applies exact dimension rules (for example UPSC 3.5×4.5 cm / 20 KB to 50 KB, NTA 10 KB to 30 KB) before uploading.",
    icon: <ShieldCheck className="w-4 h-4" aria-hidden="true" />,
    initialSize: "1.65 MB",
    targetSize: "28.5 KB",
    badge: "100% portal verified",
    actionText: "Constraining canvas to 350x450 px with 7:9 biometric crop...",
  },
  {
    id: "batch-zip",
    title: "4. Multi-Core Batch ZIP",
    duration: 6,
    description: "Distributes multiple images across dedicated client Web Workers, packaging the compressed collection into an instant ZIP.",
    icon: <FileArchive className="w-4 h-4" aria-hidden="true" />,
    initialSize: "18.4 MB (3 files)",
    targetSize: "82.5 KB (ZIP archive)",
    badge: "Off-thread Web Workers",
    actionText: "Streaming 3 files into in-memory compressed archive...",
  },
];

export default function ProductWalkthroughTour() {
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [playSpeed, setPlaySpeed] = useState<number>(1);
  const [simulatedSplit, setSimulatedSplit] = useState<number>(50);
  const [liveBytes, setLiveBytes] = useState<number>(2900000);

  const activeChapter = CHAPTERS[activeChapterIndex];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.code === "ArrowRight") {
        setActiveChapterIndex((curr) => (curr + 1) % CHAPTERS.length);
        setPlaybackTime(0);
      } else if (e.code === "ArrowLeft") {
        setActiveChapterIndex((curr) => (curr - 1 + CHAPTERS.length) % CHAPTERS.length);
        setPlaybackTime(0);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto-advance timeline loop with speed multiplier
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setPlaybackTime((prev) => {
        const nextTime = prev + 0.1 * playSpeed;
        if (nextTime >= activeChapter.duration) {
          // Advance to next chapter
          setActiveChapterIndex((curr) => (curr + 1) % CHAPTERS.length);
          return 0;
        }
        return nextTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, activeChapter.duration, playSpeed]);

  // Animated visual effects per chapter progression
  useEffect(() => {
    const progress = Math.min(1, playbackTime / activeChapter.duration);
    // Animate simulated split line smoothly across the image
    const splitSweep = 25 + Math.sin(progress * Math.PI * 2) * 35;
    setSimulatedSplit(splitSweep);

    // Animate live byte countdown
    if (activeChapterIndex === 0) {
      const start = 2900000;
      const end = 20200;
      setLiveBytes(Math.round(start - (start - end) * Math.min(1, progress * 1.4)));
    } else if (activeChapterIndex === 1) {
      const start = 491520;
      const end = 14500;
      setLiveBytes(Math.round(start - (start - end) * Math.min(1, progress * 1.2)));
    } else if (activeChapterIndex === 2) {
      const start = 1730000;
      const end = 29100;
      setLiveBytes(Math.round(start - (start - end) * Math.min(1, progress * 1.3)));
    } else {
      const start = 19293798;
      const end = 84408;
      setLiveBytes(Math.round(start - (start - end) * Math.min(1, progress * 1.5)));
    }
  }, [playbackTime, activeChapterIndex, activeChapter.duration]);

  const handleSelectChapter = (index: number) => {
    setActiveChapterIndex(index);
    setPlaybackTime(0);
    setIsPlaying(true);
  };

  const handleRestart = () => {
    setPlaybackTime(0);
    setIsPlaying(true);
  };

  const formattedLiveSize = liveBytes > 1048576 
    ? `${(liveBytes / 1048576).toFixed(2)} MB` 
    : `${(liveBytes / 1024).toFixed(1)} KB`;

  const chapterProgress = playbackTime / activeChapter.duration;

  return (
    <section id="product-tour" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[var(--color-rule)]">
      {/* Section Masthead */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[var(--color-ink)]">
              Interactive demonstration
            </span>
            <span className="text-xs text-[var(--color-ok)] flex items-center gap-1 font-normal">
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> Live visual workflow
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
            How PressZero executes exact compression
          </h2>
          <p className="text-sm text-[var(--color-muted)] mt-1.5 leading-relaxed">
            Real sample assets demonstrating binary search bisection, adaptive paper bleaching, biometric cropping, and multi-core batching.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="#studio"
            className="btn-primary inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)] whitespace-nowrap"
          >
            <span>Launch studio workbench</span>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Main Video Tour Player Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Video Simulation Player Viewport (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between rounded-xl panel-console overflow-hidden border border-[var(--color-rule)]">
          {/* Simulated Window Chrome Bar */}
          <div className="px-4 py-2.5 bg-[var(--color-paper-3)] border-b border-[var(--color-rule)] flex items-center justify-between text-xs text-[var(--color-muted)]">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-rule-2)]" aria-hidden="true" />
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-rule-2)]" aria-hidden="true" />
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-rule-2)]" aria-hidden="true" />
              </div>
              <span className="text-[11px] text-[var(--color-muted)] ml-2">
                presszero.app/workflow/{activeChapter.id}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[var(--color-ink)]">
                <span className="font-measured">{playbackTime.toFixed(1)}</span>s / <span className="font-measured">{activeChapter.duration}.0</span>s
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ok)] motion-safe:animate-pulse" aria-hidden="true" />
            </div>
          </div>

          {/* Interactive Player Screen Canvas with REAL IMAGES */}
          <div className="relative w-full h-[420px] sm:h-[480px] panel-well overflow-hidden flex flex-col justify-between p-4 sm:p-6 select-none">
            {/* Telemetry HUD Top Bar */}
            <div className="flex items-center justify-between z-20">
              <div className="px-2.5 py-1 rounded bg-[var(--color-paper)]/95 border border-[var(--color-rule)] text-xs text-[var(--color-muted)] flex items-center gap-2">
                <span>Input:</span>
                <span className="font-measured text-[var(--color-ink)] font-medium">
                  {activeChapter.initialSize}
                </span>
              </div>

              <div className="px-2.5 py-1 rounded bg-[var(--color-paper)]/95 border border-[var(--color-rule-2)] text-xs text-[var(--color-ink)] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ok)]" aria-hidden="true" />
                <span>Realtime stream:</span>
                <strong className="font-measured text-[var(--color-ink)]">
                  {formattedLiveSize}
                </strong>
              </div>
            </div>

            {/* Center Visual Arena: Specialized Visual Demonstration Per Chapter */}
            <div className="relative my-auto w-full h-[300px] sm:h-[340px] rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] overflow-hidden flex items-center justify-center">
              
              {/* Chapter 0: Dual-Axis Binary Search Bisection (Real Passport Photo) */}
              {activeChapterIndex === 0 && (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  {/* Left Side: Original High-Res Image (2.84 MB) */}
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-paper-3)]">
                    <img
                      src="/samples/passport_sample.jpg"
                      alt="Original Passport Photograph"
                      className="w-full h-full object-contain filter contrast-95"
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 rounded bg-[var(--color-paper)]/95 border border-[var(--color-rule)] text-[10px] text-[var(--color-muted)] z-10">
                      Raw Capture · 2.84 MB (300 DPI)
                    </div>
                  </div>

                  {/* Right Side: Bisected 19.8 KB Result */}
                  <div
                    style={{ clipPath: `inset(0 0 0 ${simulatedSplit}%)` }}
                    className="absolute inset-0 flex items-center justify-center bg-[var(--color-paper-3)] z-10"
                  >
                    <img
                      src="/samples/passport_sample.jpg"
                      alt="Quantized Compressed Passport"
                      className="w-full h-full object-contain filter brightness-105"
                    />
                    <div className="absolute top-3 right-3 px-2 py-1 rounded bg-[var(--color-paper)]/95 border border-[var(--color-rule)] text-[10px] text-[var(--color-ok)] z-10 flex items-center gap-1.5">
                      <Check className="w-3 h-3" aria-hidden="true" />
                      <span>Bisected · 19.8 KB (Converged)</span>
                    </div>
                  </div>

                  {/* Sweeping Split Divider Line */}
                  <div
                    style={{ left: `${simulatedSplit}%` }}
                    className="absolute inset-y-0 w-0.5 bg-[var(--color-ink)] pointer-events-none z-20"
                  >
                    <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--color-paper)] border border-[var(--color-ink)] flex items-center justify-center text-[10px] text-[var(--color-ink)] font-bold shadow-lg">
                      ⇄
                    </div>
                  </div>

                  {/* Floating Bisection Step Badge */}
                  <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between p-2 rounded bg-[var(--color-paper)]/95 border border-[var(--color-rule)] text-[11px]">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-3.5 h-3.5 text-[var(--color-ok)]" aria-hidden="true" />
                      <span className="text-[var(--color-muted)]">Binary quantization step:</span>
                      <span className="font-measured text-[var(--color-ink)] font-medium">
                        {playbackTime < 2 ? "Step 1 (Q: 50% -> 182 KB)" : playbackTime < 4 ? "Step 2 (Q: 25% -> 54 KB)" : "Step 4 (Q: 7.8% -> 19.8 KB)"}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--color-ok)]/20 text-[var(--color-ok)] border border-[var(--color-ok)]/30">
                      Target 20 KB Ceiling Met
                    </span>
                  </div>
                </div>
              )}

              {/* Chapter 1: Signature Ink Bleach (Real Handwritten Signature) */}
              {activeChapterIndex === 1 && (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[var(--color-paper-3)]">
                  {/* Left Side: Raw Shadowed Smartphone Signature */}
                  <div className="absolute inset-0 flex items-center justify-center p-6 bg-[var(--color-paper-2)]">
                    <img
                      src="/samples/signature_sample.jpg"
                      alt="Raw Smartphone Signature with Shadow"
                      className="max-h-full max-w-full object-contain filter brightness-90 sepia-[0.35]"
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 rounded bg-[var(--color-paper)]/95 border border-[var(--color-rule)] text-[10px] text-[var(--color-muted)] z-10">
                      Raw Phone Photo · Desk Shadows &amp; Yellow Grain
                    </div>
                  </div>

                  {/* Right Side: Bleached Pure White Background Signature */}
                  <div
                    style={{ clipPath: `inset(0 0 0 ${simulatedSplit}%)` }}
                    className="absolute inset-0 flex items-center justify-center p-6 bg-white z-10"
                  >
                    <img
                      src="/samples/signature_sample.jpg"
                      alt="Bleached Signature with Pure White Background"
                      className="max-h-full max-w-full object-contain filter contrast-[4] grayscale brightness-[1.15]"
                    />
                    <div className="absolute top-3 right-3 px-2 py-1 rounded bg-[var(--color-paper)]/95 border border-[var(--color-ok)]/40 text-[10px] text-[var(--color-ok)] z-10 flex items-center gap-1.5">
                      <Check className="w-3 h-3" aria-hidden="true" />
                      <span>Bleached #FFFFFF · 14.2 KB</span>
                    </div>
                  </div>

                  {/* Sweeping Split Divider Line */}
                  <div
                    style={{ left: `${simulatedSplit}%` }}
                    className="absolute inset-y-0 w-0.5 bg-[var(--color-ink)] pointer-events-none z-20"
                  >
                    <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--color-paper)] border border-[var(--color-ink)] flex items-center justify-center text-[10px] text-[var(--color-ink)] font-bold shadow-lg">
                      ⇄
                    </div>
                  </div>

                  {/* Floating Bleach Status Info Bar */}
                  <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between p-2 rounded bg-[var(--color-paper)]/95 border border-[var(--color-rule)] text-[11px]">
                    <div className="flex items-center gap-2">
                      <FileSignature className="w-3.5 h-3.5 text-[var(--color-ok)]" aria-hidden="true" />
                      <span className="text-[var(--color-muted)]">Adaptive High-Pass Threshold:</span>
                      <span className="font-measured text-[var(--color-ink)] font-medium">210 / 255</span>
                    </div>
                    <span className="text-[10px] text-[var(--color-ok)] font-medium">
                      Paper Shadows Removed · UPSC &amp; NTA Approved
                    </span>
                  </div>
                </div>
              )}

              {/* Chapter 2: Exam Portal Biometric Framing (Real Passport Photo) */}
              {activeChapterIndex === 2 && (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[var(--color-paper-3)]">
                  {/* Real Portrait Image */}
                  <img
                    src="/samples/passport_sample.jpg"
                    alt="Biometric Passport Framing"
                    className="h-full w-auto object-contain filter contrast-105"
                  />

                  {/* Biometric Viewfinder Frame */}
                  <div className="absolute w-52 h-64 border-2 border-[var(--color-ok)] rounded-lg pointer-events-none flex flex-col justify-between p-2 z-10 shadow-sm">
                    {/* Top Guide: Eye Level Line */}
                    <div className="w-full flex items-center justify-between">
                      <span className="text-[9px] text-[var(--color-ok)] bg-[var(--color-paper)]/95 px-1 rounded border border-[var(--color-rule)]">
                        Eye Level (60%)
                      </span>
                      <span className="text-[9px] text-[var(--color-ok)] bg-[var(--color-paper)]/95 px-1 rounded border border-[var(--color-rule)]">
                        7:9 Ratio
                      </span>
                    </div>

                    <div className="w-full border-t border-dashed border-[var(--color-ok)]/60 my-auto relative">
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[8px] text-[var(--color-ok)] bg-[var(--color-paper)]/95 px-1 rounded border border-[var(--color-rule)]">
                        Biometric Eye Alignment Axis
                      </span>
                    </div>

                    {/* Bottom Guide: Chin Line */}
                    <div className="w-full flex items-center justify-between">
                      <span className="text-[9px] text-[var(--color-ok)] bg-[var(--color-paper)]/95 px-1 rounded border border-[var(--color-rule)]">
                        Chin Boundary
                      </span>
                      <span className="text-[9px] font-measured text-[var(--color-ok)] bg-[var(--color-paper)]/95 px-1 rounded border border-[var(--color-rule)]">
                        350×450 px
                      </span>
                    </div>
                  </div>

                  {/* Floating Portal Validation Capsule */}
                  <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between p-2 rounded bg-[var(--color-paper)]/95 border border-[var(--color-rule)] text-[11px]">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-ok)]" aria-hidden="true" />
                      <span className="text-[var(--color-muted)]">Portal Preset:</span>
                      <span className="text-[var(--color-ink)] font-medium">UPSC / NTA Civil Services &amp; NEET</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--color-ok)]/20 text-[var(--color-ok)] border border-[var(--color-ok)]/30">
                      100% Dimension &amp; KB Compliant
                    </span>
                  </div>
                </div>
              )}

              {/* Chapter 3: Multi-Core Worker Pool Batch (Real Image Thumbnails) */}
              {activeChapterIndex === 3 && (
                <div className="relative w-full h-full flex flex-col justify-between p-4 overflow-hidden bg-[var(--color-paper-3)]">
                  <div className="flex items-center justify-between text-xs pb-1 border-b border-[var(--color-rule)]">
                    <span className="flex items-center gap-1.5 text-[var(--color-ink)] font-medium">
                      <Layers className="w-3.5 h-3.5 text-[var(--color-ok)]" aria-hidden="true" />
                      <span>Concurrent Web Worker pipeline</span>
                    </span>
                    <span className="text-[11px] text-[var(--color-ok)]">3 Cores Active</span>
                  </div>

                  {/* 3 Real Batch Cards */}
                  <div className="grid grid-cols-3 gap-3 my-auto">
                    {/* Card 1: Passport Photo */}
                    <div className="p-2.5 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-2 flex flex-col items-center text-center">
                      <div className="w-14 h-16 rounded overflow-hidden border border-[var(--color-rule)] relative bg-black">
                        <img
                          src="/samples/passport_sample.jpg"
                          alt="Batch Item 1"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-full space-y-1">
                        <span className="text-[10px] font-medium text-[var(--color-ink)] block truncate">photo.jpg</span>
                        <div className="w-full h-1 rounded-full bg-[var(--color-paper-3)] overflow-hidden">
                          <div
                            style={{ transform: `scaleX(${Math.min(1, chapterProgress * 1.3)})` }}
                            className="h-full bg-[var(--color-ok)] origin-left transition-transform duration-75"
                          />
                        </div>
                        <span className="text-[9px] text-[var(--color-ok)] font-mono block">19.8 KB (Worker 1)</span>
                      </div>
                    </div>

                    {/* Card 2: Signature */}
                    <div className="p-2.5 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-2 flex flex-col items-center text-center">
                      <div className="w-14 h-16 rounded overflow-hidden border border-[var(--color-rule)] relative bg-white flex items-center justify-center">
                        <img
                          src="/samples/signature_sample.jpg"
                          alt="Batch Item 2"
                          className="w-full h-full object-contain filter contrast-200"
                        />
                      </div>
                      <div className="w-full space-y-1">
                        <span className="text-[10px] font-medium text-[var(--color-ink)] block truncate">sign.jpg</span>
                        <div className="w-full h-1 rounded-full bg-[var(--color-paper-3)] overflow-hidden">
                          <div
                            style={{ transform: `scaleX(${Math.min(1, chapterProgress * 1.5)})` }}
                            className="h-full bg-[var(--color-ok)] origin-left transition-transform duration-75"
                          />
                        </div>
                        <span className="text-[9px] text-[var(--color-ok)] font-mono block">14.2 KB (Worker 2)</span>
                      </div>
                    </div>

                    {/* Card 3: Document Certificate */}
                    <div className="p-2.5 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-2 flex flex-col items-center text-center">
                      <div className="w-14 h-16 rounded overflow-hidden border border-[var(--color-rule)] relative bg-black">
                        <img
                          src="/samples/document_sample.jpg"
                          alt="Batch Item 3"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-full space-y-1">
                        <span className="text-[10px] font-medium text-[var(--color-ink)] block truncate">cert.jpg</span>
                        <div className="w-full h-1 rounded-full bg-[var(--color-paper-3)] overflow-hidden">
                          <div
                            style={{ transform: `scaleX(${Math.min(1, chapterProgress * 1.2)})` }}
                            className="h-full bg-[var(--color-ok)] origin-left transition-transform duration-75"
                          />
                        </div>
                        <span className="text-[9px] text-[var(--color-ok)] font-mono block">48.5 KB (Worker 3)</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom ZIP Archive Status Bar */}
                  <div className="flex items-center justify-between p-2 rounded bg-[var(--color-paper)]/95 border border-[var(--color-rule)] text-[11px]">
                    <div className="flex items-center gap-2">
                      <FileArchive className="w-3.5 h-3.5 text-[var(--color-ok)]" aria-hidden="true" />
                      <span className="text-[var(--color-muted)]">In-Memory ZIP Packaging:</span>
                      <span className="font-mono text-[var(--color-ink)] font-medium">PressZero-Batch.zip</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--color-ok)]/20 text-[var(--color-ok)] border border-[var(--color-ok)]/30">
                      82.5 KB · Ready to Export
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Target Reached Status */}
            <div className="flex items-center justify-between text-xs z-20">
              <div className="text-[11px] text-[var(--color-muted)] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ok)]" aria-hidden="true" />
                <span>Target limit: <strong>{activeChapter.targetSize}</strong></span>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--color-paper)] border border-[var(--color-rule)] text-[var(--color-ink)]">
                {activeChapter.badge}
              </span>
            </div>

            {/* Play/Pause Overlay Control on Center Hover */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors duration-150 group cursor-pointer z-30 active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
              title={isPlaying ? "Pause tour" : "Play tour"}
            >
              <div className="w-12 h-12 rounded-full bg-[var(--color-ink)] text-[var(--color-accent-ink)] flex items-center justify-center shadow-lg motion-safe:group-hover:scale-105 motion-safe:transition-transform duration-150">
                {isPlaying ? <Pause className="w-5 h-5" aria-hidden="true" /> : <Play className="w-5 h-5 ml-0.5" aria-hidden="true" />}
              </div>
            </button>
          </div>

          {/* Bottom Video Transport Bar */}
          <div className="p-3 bg-[var(--color-paper-3)] border-t border-[var(--color-rule)] flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Play/Pause & Restart Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-md hover:bg-[var(--color-paper-2)] text-[var(--color-ink)] transition-colors duration-150 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
              >
                {isPlaying ? <Pause className="w-4 h-4" aria-hidden="true" /> : <Play className="w-4 h-4" aria-hidden="true" />}
              </button>
              <button
                type="button"
                onClick={handleRestart}
                className="p-1.5 rounded-md hover:bg-[var(--color-paper-2)] text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors duration-150 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
                title="Restart chapter"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <span className="text-[11px] text-[var(--color-muted)] hidden sm:inline">
                {activeChapter.title}
              </span>
            </div>

            {/* Micro Scrubbing Progress Bar */}
            <div className="flex-1 max-w-xs mx-2">
              <div className="w-full h-1.5 rounded-full bg-[var(--color-rule)] overflow-hidden">
                <div
                  style={{ transform: `scaleX(${playbackTime / activeChapter.duration})` }}
                  className="h-full w-full bg-[var(--color-ink)] origin-left transition-transform duration-75"
                />
              </div>
            </div>

            {/* Speed Multiplier Controls */}
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-[var(--color-muted)] mr-1 hidden sm:inline">Speed:</span>
              {[1, 1.5, 2].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setPlaySpeed(spd)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium border cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)] ${
                    playSpeed === spd
                      ? "bg-[var(--color-ink)] text-[var(--color-accent-ink)] border-[var(--color-ink)]"
                      : "bg-[var(--color-paper)] text-[var(--color-muted)] border-[var(--color-rule)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  <span className="font-measured">{spd}</span>x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Chapter Selection Deck (4 Cols) */}
        <div className="lg:col-span-4 space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold text-[var(--color-ink)]">
              Walkthrough chapters
            </h3>
            <p className="text-xs text-[var(--color-muted)]">
              Select any phase to view how the client-side pipeline handles that specific step.
            </p>

            <div className="space-y-2 pt-1">
              {CHAPTERS.map((chap, idx) => {
                const isActive = activeChapterIndex === idx;
                return (
                  <button
                    key={chap.id}
                    type="button"
                    onClick={() => handleSelectChapter(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border cursor-pointer transition-colors duration-150 ${
                      isActive
                        ? "bg-[var(--color-paper-2)] border-[var(--color-ink)] text-[var(--color-ink)]"
                        : "bg-[var(--color-paper)] border-[var(--color-rule)] text-[var(--color-muted)] hover:border-[var(--color-rule-2)] hover:text-[var(--color-ink)]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`p-1 rounded ${isActive ? "bg-[var(--color-ink)] text-[var(--color-accent-ink)]" : "bg-[var(--color-paper-3)] text-[var(--color-muted)]"}`}>
                          {chap.icon}
                        </span>
                        <h4 className="text-xs font-semibold text-[var(--color-ink)]">
                          {chap.title}
                        </h4>
                      </div>
                      <span className="text-[10px] text-[var(--color-muted)]">
                        <span className="font-measured">{chap.duration}</span>s
                      </span>
                    </div>

                    <p className="text-[11px] text-[var(--color-muted)] line-clamp-2 leading-relaxed pl-7">
                      {chap.description}
                    </p>

                    {isActive && (
                      <div className="mt-2.5 pt-2 border-t border-[var(--color-rule)] flex items-center justify-between text-[11px] pl-7">
                        <span className="text-[var(--color-ok)] font-medium">Currently playing</span>
                        <span className="font-measured text-[var(--color-ink)]">{chap.targetSize}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Jump to Studio Card */}
          <div className="p-4 rounded-xl panel-console border border-[var(--color-rule)] space-y-2 mt-2">
            <h4 className="text-xs font-semibold text-[var(--color-ink)]">
              Ready for production use?
            </h4>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed">
              Drop your real photos and signatures in the full Studio Workbench below.
            </p>
            <a
              href="#studio"
              className="w-full btn-primary py-2 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer mt-1 active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)] whitespace-nowrap"
            >
              <span>Scroll to studio</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
