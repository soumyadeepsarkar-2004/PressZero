"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import StudioWorkspace from "@/components/studio/StudioWorkspace";
import { ArrowLeft, ShieldCheck, Smartphone, Sparkles } from "lucide-react";
import PwaInstallPrompt from "@/components/layout/PwaInstallPrompt";

function StudioContent() {
  const searchParams = useSearchParams();
  const presetFromQuery = searchParams.get("preset") || undefined;
  const featureFromQuery = searchParams.get("feature") || undefined;

  return (
    <div className="min-h-screen bg-[var(--color-paper)]">
      {/* Top Utility Bar for Dedicated App Experience */}
      <div className="border-b border-[var(--color-rule)] bg-[var(--color-paper-2)]/80 backdrop-blur-sm sticky top-14 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-[var(--color-muted)] hover:text-[var(--color-ink)] flex items-center gap-1.5 transition-colors cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to overview</span>
            </Link>

            <span className="text-[var(--color-rule-2)]">/</span>

            <span className="text-[var(--color-ink)] font-medium flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[var(--color-ok)]" />
              Production batch studio
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1 text-[var(--color-muted)] text-[11px]">
              <ShieldCheck className="w-3 h-3 text-[var(--color-ok)]" />
              <span>Local memory heap execution</span>
            </span>
            <PwaInstallPrompt />
          </div>
        </div>
      </div>

      {/* Full Dedicated Studio Workbench */}
      <div className="py-6">
        <StudioWorkspace 
          selectedPresetId={presetFromQuery} 
          selectedFeature={featureFromQuery}
        />
      </div>
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-xs text-[var(--color-muted)]">
        Loading PressZero Studio...
      </div>
    }>
      <StudioContent />
    </Suspense>
  );
}