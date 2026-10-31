"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import PressZeroLogo from "@/components/common/PressZeroLogo";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log exception defensively for monitoring
    console.error("PressZero runtime error caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col justify-between p-6 sm:p-10 select-none">
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="inline-block">
          <PressZeroLogo size={28} showWordmark={true} />
        </Link>
      </header>

      <main className="max-w-xl mx-auto w-full my-auto text-center space-y-6">
        <div className="w-12 h-12 rounded-xl bg-[var(--color-paper-2)] border border-[var(--color-rule-2)] flex items-center justify-center mx-auto text-red-400">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[var(--color-muted)]">
            State recovered
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
            An unexpected error occurred
          </h1>
          <p className="text-sm text-[var(--color-muted)] leading-relaxed">
            The local memory heap encountered an unhandled exception. Your local documents remain intact on your machine.
          </p>
        </div>

        {error.message && (
          <div className="p-3.5 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-left font-mono text-xs text-[var(--color-muted)] overflow-x-auto">
            <code>{error.message}</code>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="btn-primary px-5 py-2.5 text-xs font-medium inline-flex items-center gap-2 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reinitialize instrument</span>
          </button>

          <Link
            href="/"
            className="btn-ghost px-5 py-2.5 text-xs font-medium inline-flex items-center gap-2 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to overview</span>
          </Link>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto w-full text-center text-xs text-[var(--color-muted)] border-t border-[var(--color-rule)] pt-6">
        <span>Zero-knowledge client compute · Zero server storage</span>
      </footer>
    </div>
  );
}
