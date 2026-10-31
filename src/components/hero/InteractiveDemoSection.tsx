"use client";

import React, { useState } from "react";
import Link from "next/link";
import HeroMicroCompressor from "./HeroMicroCompressor";
import { ArrowRight, CheckCircle2, Play, Sparkles, Layers, ShieldCheck } from "lucide-react";
import VideoDemoModal, { VideoTopic } from "@/components/common/VideoDemoModal";

export default function InteractiveDemoSection() {
  const [videoModalTopic, setVideoModalTopic] = useState<VideoTopic | null>(null);

  return (
    <section id="demo" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[var(--color-rule)]">
      {/* Section Masthead with Clear Demonstration Purpose Disclaimer */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[var(--color-ink)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ok)] motion-safe:animate-pulse" />
              Live interactive demo
            </span>
            <span className="text-xs text-[var(--color-muted)] font-normal">
              For demonstration purposes only
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
            Target-exact compression sandbox
          </h2>
          <p className="text-sm text-[var(--color-muted)] leading-relaxed">
            This instrument is an interactive live demo created specifically for demonstration purposes so you can experience single-file kilobyte bisection and bleaching. For production workflows with multi-file batches, biometric cropping, and ZIP export, launch our dedicated Studio.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setVideoModalTopic("bisection")}
            className="btn-ghost px-3.5 py-1.5 text-xs font-medium flex items-center gap-1.5 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
          >
            <Play className="w-3.5 h-3.5 text-[var(--color-ok)]" />
            <span>Watch bisection video</span>
          </button>
        </div>
      </div>

      {/* Embedded Live Interactive Demo Instrument */}
      <HeroMicroCompressor />

      {/* Prominent Studio Callout Card Below the Demo */}
      <div className="mt-8 max-w-4xl mx-auto p-6 sm:p-7 rounded-2xl panel-console border border-[var(--color-rule-2)] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-rule)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-ok)]" />
            <h3 className="text-sm font-semibold text-[var(--color-ink)]">
              Looking for full production batch processing?
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[var(--color-muted)]">
            Dedicated workspace
          </span>
        </div>

        <p className="text-xs text-[var(--color-muted)] leading-relaxed">
          The demo above is calibrated for single-file testing. The dedicated Studio Workbench below provides simultaneous multi-file processing, focal aspect ratio cropping (7:3, 7:9, 1:1), 800% nearest-neighbor pixel loupe inspection, and in-memory ZIP package streaming.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs text-[var(--color-muted)]">
          <div className="p-2.5 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-1">
            <span className="text-[11px] font-medium text-[var(--color-ink)] block">Multi-file batching</span>
            <span className="text-[10px] text-[var(--color-muted)] block">Queue 50+ files</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-1">
            <span className="text-[11px] font-medium text-[var(--color-ink)] block">Focal cropper (C)</span>
            <span className="text-[10px] text-[var(--color-muted)] block">Biometric aspect ratios</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-1">
            <span className="text-[11px] font-medium text-[var(--color-ink)] block">800% Loupe (Z)</span>
            <span className="text-[10px] text-[var(--color-muted)] block">DCT artifact inspection</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-1">
            <span className="text-[11px] font-medium text-[var(--color-ink)] block">ZIP packaging</span>
            <span className="text-[10px] text-[var(--color-muted)] block">In-memory streaming</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[var(--color-ok)] font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero server storage · 100% client execution</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => setVideoModalTopic("batch")}
              className="w-full sm:w-auto btn-ghost px-4 py-2 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
            >
              <Play className="w-3.5 h-3.5 text-[var(--color-ok)]" />
              <span>Watch batch video</span>
            </button>

            <Link
              href="/studio"
              className="w-full sm:w-auto btn-primary px-5 py-2 text-xs font-medium flex items-center justify-center gap-2 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
            >
              <span>Launch studio workbench</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Video Modal if opened */}
      {videoModalTopic && (
        <VideoDemoModal
          isOpen={true}
          onClose={() => setVideoModalTopic(null)}
          topic={videoModalTopic}
        />
      )}
    </section>
  );
}