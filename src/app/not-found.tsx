"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, Sliders } from "lucide-react";
import PressZeroLogo from "@/components/common/PressZeroLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col justify-between p-6 sm:p-10 select-none">
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="inline-block">
          <PressZeroLogo size={28} showWordmark={true} />
        </Link>
      </header>

      <main className="max-w-lg mx-auto w-full my-auto text-center space-y-6">
        <div className="space-y-2">
          <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[var(--color-muted)]">
            404: Not Found
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--color-ink)]">
            Page does not exist
          </h1>
          <p className="text-sm text-[var(--color-muted)] leading-relaxed">
            The requested route could not be found. You can return to the overview or launch the compression studio.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="btn-primary px-5 py-2.5 text-xs font-medium inline-flex items-center gap-2 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to overview</span>
          </Link>

          <Link
            href="/studio"
            className="btn-ghost px-5 py-2.5 text-xs font-medium inline-flex items-center gap-2 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Launch studio</span>
          </Link>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto w-full text-center text-xs text-[var(--color-muted)] border-t border-[var(--color-rule)] pt-6">
        <span>Zero-knowledge client compute · Zero server storage</span>
      </footer>
    </div>
  );
}
