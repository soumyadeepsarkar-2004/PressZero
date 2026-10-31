"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Smartphone, ShieldCheck, Sparkles } from "lucide-react";
import PwaInstallPrompt from "./PwaInstallPrompt";

export default function BottomCtaBanner() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[var(--color-rule)]">
      <div className="relative rounded-2xl panel-console border border-[var(--color-rule-2)] p-8 sm:p-12 lg:p-16 overflow-hidden text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-xs text-[var(--color-ok)] mx-auto font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero server storage · 100% client side compute</span>
        </div>

        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[var(--color-ink)] leading-[1.1]">
            Ready to compress your official documents?
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed font-normal">
            Launch the full production studio to process high-resolution batches, crop biometric aspect ratios, and download verified ZIP packages.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/studio"
            className="btn-primary px-6 py-3 text-sm font-medium inline-flex items-center gap-2 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
          >
            <span>Open studio workbench</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <PwaInstallPrompt />
        </div>

        <div className="pt-6 border-t border-[var(--color-rule)] flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--color-muted)]">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-ink)]" />
            No account required
          </span>
          <span className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-[var(--color-ink)]" />
            Installable as desktop and mobile app
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-ok)]" />
            Verifiable zero network egress
          </span>
        </div>
      </div>
    </section>
  );
}