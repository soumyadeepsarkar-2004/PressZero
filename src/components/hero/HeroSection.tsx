"use client";

import React from "react";
import Link from "next/link";
import { 
  Play, 
  ArrowRight, 
  Download,
  ChevronDown 
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[calc(100dvh-3.5rem)] flex flex-col justify-between pt-12 pb-8 sm:pt-20 sm:pb-10 lg:pt-28 lg:pb-12 overflow-hidden border-b border-[var(--color-rule)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full my-auto">
        {/* Editorial Heading Block with Grand Minimalist Scale */}
        <div className="text-center space-y-6 sm:space-y-8 max-w-4xl mx-auto">
          {/* Top Verification Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-xs text-[var(--color-ink)] mx-auto font-medium">
            <span className="w-2 h-2 rounded-full bg-[var(--color-ok)] motion-safe:animate-pulse" aria-hidden="true" />
            <span>100% on-device image compression · Zero server uploads</span>
          </div>

          {/* Grand Master Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-[-0.035em] text-[var(--color-ink)] leading-[1.05]">
            The exact target-KB image reducer.
          </h1>

          {/* Editorial Subtitle - 11 words */}
          <p className="text-base sm:text-lg md:text-xl text-[var(--color-muted)] max-w-2xl mx-auto font-normal leading-relaxed">
            Reduces photos and signatures to exact kilobyte limits directly in your browser.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full max-w-md mx-auto sm:max-w-none">
            <Link
              href="/studio"
              className="btn-primary w-full sm:w-auto px-6 py-3 text-sm font-medium inline-flex items-center justify-center gap-2 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)] shadow-sm"
            >
              <span>Launch studio workbench</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>

            <a
              href="#product-tour"
              className="btn-ghost w-full sm:w-auto px-5 py-3 text-sm font-medium inline-flex items-center justify-center gap-2 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
            >
              <Play className="w-3.5 h-3.5 text-[var(--color-ok)]" aria-hidden="true" />
              <span>Watch video walkthrough</span>
            </a>

            <Link
              href="/download"
              className="w-full sm:w-auto px-4 py-3 text-xs font-medium inline-flex items-center justify-center gap-1.5 text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors duration-150 cursor-pointer active:scale-98"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Desktop app (.exe and .app)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Discreet Bottom Scroll Cue */}
      <div className="w-full pt-6 flex flex-col items-center justify-center relative z-10">
        <a
          href="#product-tour"
          className="group inline-flex flex-col items-center gap-1.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors duration-150 cursor-pointer"
          aria-label="Scroll to explore interactive tour and demo"
        >
          <span className="text-[11px] font-normal">Explore interactive tour and demo</span>
          <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform duration-200" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
