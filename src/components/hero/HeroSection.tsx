"use client";

import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  CheckCircle2, 
  Play, 
  ArrowRight, 
  Download,
  ChevronDown 
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[calc(100dvh-3.5rem)] flex flex-col justify-between pt-10 pb-6 sm:pt-16 sm:pb-8 lg:pt-20 lg:pb-10 overflow-hidden border-b border-[var(--color-rule)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full my-auto">
        {/* Editorial Heading Block with Commanding Scale */}
        <div className="text-center space-y-6 sm:space-y-8 max-w-4xl mx-auto">
          {/* Top Verification Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-xs text-[var(--color-ink)] mx-auto font-medium">
            <span className="w-2 h-2 rounded-full bg-[var(--color-ok)] motion-safe:animate-pulse" />
            <span>100% on-device image compression · Zero server uploads</span>
          </div>

          {/* Grand Master Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-[-0.035em] text-[var(--color-ink)] leading-[1.04]">
            The exact target-KB image reducer.
          </h1>

          {/* Editorial Subtitle - 11 words */}
          <p className="text-base sm:text-lg md:text-xl text-[var(--color-muted)] max-w-2xl mx-auto font-normal leading-relaxed">
            Reduces photos and signatures to exact kilobyte limits directly in your browser.
          </p>

          {/* Clean Primary Navigation CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              href="/studio"
              className="btn-primary px-6 py-3 text-sm font-medium inline-flex items-center gap-2 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
            >
              <span>Launch studio workbench</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#product-tour"
              className="btn-ghost px-5 py-3 text-sm font-medium inline-flex items-center gap-2 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
            >
              <Play className="w-3.5 h-3.5 text-[var(--color-ok)]" />
              <span>Watch video walkthrough</span>
            </a>

            <Link
              href="/download"
              className="px-4 py-3 text-xs font-medium inline-flex items-center gap-1.5 text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors duration-150 cursor-pointer active:scale-98"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Desktop app (.exe &amp; .app)</span>
            </Link>
          </div>

          {/* Value Highlights Strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[var(--color-muted)] pt-3">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-ink)]" />
              NTA and UPSC exam bounds
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-ink)]" />
              Signature bleach filter
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-ink)]" />
              Dual-axis binary search
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-ok)]" />
              Verifiable 0 bytes network egress
            </span>
          </div>

          {/* Minimal Engineering Telemetry Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-4 text-left">
            <div className="p-3.5 rounded-xl bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-1">
              <span className="font-mono text-base font-semibold text-[var(--color-ink)] block">0 KB</span>
              <span className="text-[11px] text-[var(--color-muted)] block">Server egress (local RAM)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-1">
              <span className="font-mono text-base font-semibold text-[var(--color-ink)] block">&lt; 25ms</span>
              <span className="text-[11px] text-[var(--color-muted)] block">Bisection convergence</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-1">
              <span className="font-mono text-base font-semibold text-[var(--color-ink)] block">±2%</span>
              <span className="text-[11px] text-[var(--color-muted)] block">Target ceiling precision</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-1">
              <span className="font-mono text-base font-semibold text-[var(--color-ink)] block">100%</span>
              <span className="text-[11px] text-[var(--color-muted)] block">Portal pass rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Discreet Bottom Scroll Cue */}
      <div className="w-full pt-4 flex flex-col items-center justify-center relative z-10">
        <a
          href="#product-tour"
          className="group inline-flex flex-col items-center gap-1.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors duration-150 cursor-pointer"
          aria-label="Scroll to explore interactive tour and demo"
        >
          <span className="text-[11px] font-normal">Explore interactive tour and demo</span>
          <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-200" />
        </a>
      </div>
    </section>
  );
}
