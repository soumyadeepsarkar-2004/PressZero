"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight,
  Sliders,
  FileSignature,
  Crop,
  ZoomIn,
  Layers
} from "lucide-react";

export type VideoTopic = "bisection" | "bleach" | "cropper" | "loupe" | "batch";

interface TopicData {
  title: string;
  duration: number; // in seconds
  description: string;
  icon: React.ReactNode;
  stepLabels: string[];
}

const TOPICS: Record<VideoTopic, TopicData> = {
  bisection: {
    title: "Exact Kilobyte Bisection Engine",
    duration: 6,
    description: "Binary search bisects quality matrix and downscales dimensions to land within exact kilobyte limits.",
    icon: <Sliders className="w-4 h-4 text-[var(--color-ink)]" />,
    stepLabels: [
      "Step 1: Quality 50% (180 KB - High)",
      "Step 2: Quality 25% (54 KB - High)",
      "Step 3: Quality 12% (28 KB - Approaching)",
      "Step 4: Quality 7.8% (19.8 KB - Converged in 24ms)"
    ],
  },
  bleach: {
    title: "Signature Ink Bleach Filter",
    duration: 6,
    description: "Adaptive thresholding removes smartphone shadows and yellow casts, locking paper to pure white.",
    icon: <FileSignature className="w-4 h-4 text-[var(--color-ink)]" />,
    stepLabels: [
      "1. Scan raw image luminance histogram",
      "2. Calculate adaptive paper threshold cutoff (210)",
      "3. Bleach shadow artifacts to pure white #ffffff",
      "4. Boost pen stroke ink density by +350%"
    ],
  },
  cropper: {
    title: "Biometric Aspect Ratio Cropper",
    duration: 6,
    description: "Lock official passport (7:9), signature (7:3), and visa (1:1) aspect ratios with rule-of-thirds overlays.",
    icon: <Crop className="w-4 h-4 text-[var(--color-ink)]" />,
    stepLabels: [
      "1. Press C or click Crop on any active item",
      "2. Select preset aspect ratio (UPSC 7:9 or NTA 7:3)",
      "3. Adjust focal boundary box with handles",
      "4. Apply crop to instantly re-compress"
    ],
  },
  loupe: {
    title: "800% Pixel Inspection Loupe",
    duration: 6,
    description: "Inspect nearest-neighbor pixel grids, DCT compression blocks, and ringing artifacts with split wipes.",
    icon: <ZoomIn className="w-4 h-4 text-[var(--color-ink)]" />,
    stepLabels: [
      "1. Press Z or click Loupe on any compressed file",
      "2. Toggle magnification from 1x up to 8x (800%)",
      "3. Nearest-neighbor pixel grid activates automatically",
      "4. Drag split wipe to inspect compression artifacts"
    ],
  },
  batch: {
    title: "Multi-Core Web Worker Batch Engine",
    duration: 6,
    description: "Processes multiple files concurrently across dedicated Web Worker threads, packaging an in-memory ZIP.",
    icon: <Layers className="w-4 h-4 text-[var(--color-ink)]" />,
    stepLabels: [
      "1. Drop 50+ files or paste from clipboard (Ctrl+V)",
      "2. Dispatch jobs across dedicated Web Worker threads",
      "3. Background OffscreenCanvas keeps UI responsive",
      "4. Stream all outputs into single ZIP package"
    ],
  },
};

interface VideoDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: VideoTopic;
}

export default function VideoDemoModal({ isOpen, onClose, topic }: VideoDemoModalProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [playSpeed, setPlaySpeed] = useState<number>(1);

  const data = TOPICS[topic] || TOPICS.bisection;

  // Auto-play timeline loop
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = setInterval(() => {
      setPlaybackTime((prev) => {
        const next = prev + 0.1 * playSpeed;
        if (next >= data.duration) return 0;
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, data.duration, playSpeed]);

  // Reset when topic changes
  useEffect(() => {
    setPlaybackTime(0);
    setIsPlaying(true);
  }, [topic, isOpen]);

  // Keyboard close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const progress = Math.min(1, playbackTime / data.duration);
  const activeStepIndex = Math.min(
    data.stepLabels.length - 1,
    Math.floor(progress * data.stepLabels.length)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl panel-console border border-[var(--color-rule-2)] overflow-hidden flex flex-col">
        {/* Window Chrome Header */}
        <div className="px-4 py-3 bg-[var(--color-paper-3)] border-b border-[var(--color-rule)] flex items-center justify-between text-xs text-[var(--color-muted)]">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-rule-2)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-rule-2)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-rule-2)]" />
            </div>
            <span className="text-[11px] text-[var(--color-muted)] ml-2 flex items-center gap-1">
              <span>presszero.app/video/</span>
              <strong className="text-[var(--color-ink)] font-normal">{topic}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[var(--color-ink)]">
              <span className="font-measured">{playbackTime.toFixed(1)}</span>s / <span className="font-measured">{data.duration}.0</span>s
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded text-[var(--color-muted)] hover:text-[var(--color-ink)] cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
              title="Close video modal (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Screen Viewport */}
        <div className="relative p-6 bg-[var(--color-paper-2)] border-b border-[var(--color-rule)] select-none">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-md bg-[var(--color-paper-3)] border border-[var(--color-rule)]">
                {data.icon}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-ink)]">{data.title}</h3>
                <p className="text-xs text-[var(--color-muted)]">{data.description}</p>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--color-paper)] border border-[var(--color-rule)] text-[var(--color-ok)]">
              Live simulation
            </span>
          </div>

          {/* Animated Video Simulation Stage */}
          <div className="relative h-44 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] overflow-hidden flex flex-col justify-between p-4">
            <div className="flex items-center justify-between text-[11px] text-[var(--color-muted)]">
              <span>Operational sequence</span>
              <span className="text-[var(--color-ok)] font-medium">Step {activeStepIndex + 1} of {data.stepLabels.length}</span>
            </div>

            {/* Step Visualizer */}
            <div className="space-y-1.5 my-auto">
              {data.stepLabels.map((label, idx) => {
                const isStepActive = idx === activeStepIndex;
                const isStepPassed = idx < activeStepIndex;
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between text-xs px-2.5 py-1 rounded transition-colors ${
                      isStepActive
                        ? "bg-[var(--color-paper)] border border-[var(--color-rule-2)] text-[var(--color-ink)] font-medium"
                        : isStepPassed
                        ? "text-[var(--color-muted)]"
                        : "text-[var(--color-faint)]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${isStepActive ? "bg-[var(--color-ok)]" : isStepPassed ? "bg-[var(--color-ink)]" : "bg-[var(--color-rule-2)]"}`} />
                      <span>{label}</span>
                    </span>
                    {isStepActive && (
                      <span className="text-[10px] text-[var(--color-ok)] font-normal">Active</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Scrubber inside video canvas */}
            <div className="w-full h-1 rounded-full bg-[var(--color-paper-2)] overflow-hidden">
              <div
                style={{ transform: `scaleX(${progress})` }}
                className="h-full bg-[var(--color-ink)] origin-left transition-transform duration-75"
              />
            </div>
          </div>
        </div>

        {/* Video Transport & Action Bar */}
        <div className="p-4 bg-[var(--color-paper-3)] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-md hover:bg-[var(--color-paper-2)] text-[var(--color-ink)] cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                setPlaybackTime(0);
                setIsPlaying(true);
              }}
              className="p-1.5 rounded-md hover:bg-[var(--color-paper-2)] text-[var(--color-muted)] hover:text-[var(--color-ink)] cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
              title="Restart"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1 ml-2 text-[11px]">
              {[1, 1.5, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaySpeed(spd)}
                  className={`px-1.5 py-0.2 rounded text-[10px] font-medium border cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)] ${
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

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="btn-ghost px-3 py-1.5 text-xs font-medium cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
            >
              <span>Dismiss</span>
            </button>
            <Link
              href="/studio"
              onClick={onClose}
              className="btn-primary px-3.5 py-1.5 text-xs font-medium flex items-center gap-1.5 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
            >
              <span>Open tool in studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}