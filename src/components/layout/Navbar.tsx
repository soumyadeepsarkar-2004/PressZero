"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Sliders, FileSignature, Crop, Layers, Globe, Download, BookOpen } from "lucide-react";
import PressZeroLogo from "@/components/common/PressZeroLogo";
import PwaInstallPrompt from "./PwaInstallPrompt";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-rule)] bg-[var(--color-paper)]/90 backdrop-blur-md transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Bespoke PressZero Brand Mark */}
        <Link href="/" className="group flex items-center">
          <PressZeroLogo size={28} showWordmark={true} />
        </Link>

        {/* Product Capability Navigation Links (Focused on actual software tools) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs text-[var(--color-muted)]">
          <Link
            href="/studio?feature=exact-kb"
            className="hover:text-[var(--color-ink)] transition-colors duration-150 flex items-center gap-1.5"
            title="Target exact kilobyte boundaries"
          >
            <Sliders className="w-3.5 h-3.5 text-[var(--color-ink)]" />
            <span>Target-KB engine</span>
          </Link>

          <Link
            href="/studio?feature=bleach"
            className="hover:text-[var(--color-ink)] transition-colors duration-150 flex items-center gap-1.5"
            title="Bleach scanner desk shadows to pure white"
          >
            <FileSignature className="w-3.5 h-3.5 text-[var(--color-ink)]" />
            <span>Signature bleach</span>
          </Link>

          <Link
            href="/studio?feature=crop"
            className="hover:text-[var(--color-ink)] transition-colors duration-150 flex items-center gap-1.5"
            title="Biometric focal ratio cropper"
          >
            <Crop className="w-3.5 h-3.5 text-[var(--color-ink)]" />
            <span>Biometric cropper</span>
          </Link>

          <Link
            href="/#portal-matrix"
            className="hover:text-[var(--color-ink)] transition-colors duration-150 flex items-center gap-1.5"
            title="Official UPSC, NTA, and Visa presets"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Portal matrix</span>
          </Link>

          <Link
            href="/studio?feature=batch"
            className="hover:text-[var(--color-ink)] transition-colors duration-150 flex items-center gap-1.5"
            title="Off-thread multi-core worker batching"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Batch ZIP</span>
          </Link>

          <Link
            href="/docs"
            className="hover:text-[var(--color-ink)] transition-colors duration-150 flex items-center gap-1.5"
            title="Developer documentation & architecture"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Docs</span>
          </Link>
        </nav>

        {/* Right Status Indicator, PWA Install, Download & Action CTA */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <Link
            href="/download"
            className="btn-ghost px-2.5 py-1.5 text-xs font-medium flex items-center gap-1.5 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
            title="Download PressZero for macOS, Windows & desktop"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </Link>

          <PwaInstallPrompt />

          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-xs text-[var(--color-muted)]">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-ok)]" />
            <span>0 bytes egress · client compute</span>
          </div>

          <Link
            href="/studio"
            className="btn-primary px-3.5 py-1.5 text-xs font-medium cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
          >
            <span>Open studio</span>
          </Link>
        </div>
      </div>
    </header>
  );
}