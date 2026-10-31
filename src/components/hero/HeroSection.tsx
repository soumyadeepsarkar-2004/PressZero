"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, Play, ArrowRight, Smartphone, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Heading Block with Breathing Room */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-xs text-[var(--color-ink)] mx-auto font-medium">
            <span className="w-2 h-2 rounded-full bg-[var(--color-ok)] motion-safe:animate-pulse" />
            <span>100% on-device image compression · Zero server uploads</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[var(--color-ink)] leading-[1.06]">
            The exact target-KB image reducer.
          </h1>

          <p className="text-base sm:text-lg text-[var(--color-muted)] max-w-2xl mx-auto font-normal leading-relaxed">
            Reduces photos and signatures to exact kilobyte limits inside your browser.
          </p>

          {/* Quick Value Badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[var(--color-muted)] pt-2">
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

          {/* Clean Primary Navigation Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <a
              href="#product-tour"
              className="btn-primary px-5 py-2.5 text-xs font-medium inline-flex items-center gap-2 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
            >
              <Play className="w-3.5 h-3.5 text-[var(--color-accent-ink)]" />
              <span>Watch video walkthrough</span>
            </a>

            <Link
              href="/studio"
              className="btn-ghost px-5 py-2.5 text-xs font-medium inline-flex items-center gap-2 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
            >
              <span>Launch studio workbench</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}