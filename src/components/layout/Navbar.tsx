"use client";

import React from "react";
import Link from "next/link";
import { Download, ArrowRight } from "lucide-react";
import PressZeroLogo from "@/components/common/PressZeroLogo";
import PwaInstallPrompt from "./PwaInstallPrompt";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-rule)] bg-[var(--color-paper)]/90 backdrop-blur-md transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
        {/* Brand Mark */}
        <Link href="/" className="group flex items-center shrink-0" aria-label="PressZero Home">
          <PressZeroLogo size={28} showWordmark={true} />
        </Link>

        {/* Header Actions: Download, Install App, and Open Studio */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 1. Download Button */}
          <Link
            href="/download"
            className="btn-ghost px-2.5 sm:px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
            title="Download PressZero for macOS, Windows and desktop"
          >
            <Download className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Download</span>
          </Link>

          {/* 2. Install App Button */}
          <PwaInstallPrompt />

          {/* 3. Open Studio Button */}
          <Link
            href="/studio"
            className="btn-primary px-3 sm:px-3.5 py-1.5 text-xs font-medium flex items-center gap-1.5 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)] shrink-0"
          >
            <span>Open studio</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}
