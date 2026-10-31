"use client";

import React, { useState } from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Server, 
  Laptop, 
  WifiOff, 
  Smartphone, 
  Layers,
  Cpu,
  Play
} from "lucide-react";
import VideoDemoModal from "@/components/common/VideoDemoModal";

export default function PrivacyManifesto() {
  const [videoModalOpen, setVideoModalOpen] = useState<boolean>(false);

  return (
    <section id="privacy-manifesto" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[var(--color-rule)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
        <div className="max-w-2xl">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[var(--color-ok)] mb-2">
            Architecture & security
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-ink)] tracking-tight">
            Client-side zero-knowledge architecture
          </h2>
          <p className="text-sm text-[var(--color-muted)] mt-1.5 leading-relaxed">
            The structural difference between legacy cloud uploaders and PressZero’s local hardware execution.
          </p>
        </div>

        <button
          onClick={() => setVideoModalOpen(true)}
          className="btn-ghost px-3.5 py-1.5 text-xs font-medium flex items-center gap-1.5 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
        >
          <Play className="w-3.5 h-3.5 text-[var(--color-ok)]" />
          <span>Watch privacy video demo</span>
        </button>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mb-8">
        {/* Left: Traditional Cloud Compressors */}
        <div className="p-6 sm:p-7 rounded-xl panel-console border border-[var(--color-rule)] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-400 font-medium text-xs">
              <ShieldAlert className="w-4 h-4" />
              <span>Traditional cloud uploaders</span>
            </div>
            <h3 className="text-base font-semibold text-[var(--color-ink)]">
              Documents leave your device
            </h3>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed">
              When using ordinary tools, passport photographs, signatures, and government IDs are uploaded over the internet to remote third-party cloud servers.
            </p>

            <ul className="space-y-2 text-xs text-[var(--color-muted)] pt-2">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold shrink-0">✕</span>
                <span>Files stored in remote cloud buckets vulnerable to data exposure.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold shrink-0">✕</span>
                <span>Third-party operators can inspect, retain, or scrape submitted signatures.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold shrink-0">✕</span>
                <span>Risk of identity harvesting from unencrypted server logs.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold shrink-0">✕</span>
                <span>Fails completely without active network connectivity.</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-3.5 border-t border-[var(--color-rule)] flex items-center gap-2 text-xs text-[var(--color-muted)]">
            <Server className="w-3.5 h-3.5 shrink-0 text-red-400" />
            <span>Server uploads and third-party storage</span>
          </div>
        </div>

        {/* Right: PressZero Zero-Knowledge */}
        <div className="p-6 sm:p-7 rounded-xl panel-console border border-[var(--color-rule-2)] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[var(--color-ok)] font-medium text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>PressZero architecture</span>
            </div>
            <h3 className="text-base font-semibold text-[var(--color-ink)]">
              In-browser execution with zero server storage
            </h3>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed">
              PressZero executes the entire image processing engine directly inside your web browser using HTML5 Canvas and Web Workers. No image byte leaves your machine.
            </p>

            <ul className="space-y-2 text-xs text-[var(--color-muted)] pt-2">
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-ok)] font-bold shrink-0">✓</span>
                <span><strong className="text-[var(--color-ink)]">Zero uploads:</strong> Images are processed in local memory only.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-ok)] font-bold shrink-0">✓</span>
                <span><strong className="text-[var(--color-ink)]">Zero server storage:</strong> No database or external file server exists.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-ok)] font-bold shrink-0">✓</span>
                <span><strong className="text-[var(--color-ink)]">No operator access:</strong> Platform maintainers cannot inspect your files.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-ok)] font-bold shrink-0">✓</span>
                <span><strong className="text-[var(--color-ink)]">Verifiable:</strong> Inspect the browser network tab to confirm zero bytes uploaded.</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-3.5 border-t border-[var(--color-rule)] flex items-center gap-2 text-xs text-[var(--color-ok)] font-medium">
            <Laptop className="w-3.5 h-3.5 shrink-0" />
            <span>Local client execution: Web Workers and HTML5 Canvas</span>
          </div>
        </div>
      </div>

      {/* Deep-Dive: How Does PressZero Run 100% Offline? */}
      <div className="p-6 sm:p-8 rounded-xl panel-console border border-[var(--color-rule)] space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-ok)]" />
            <h3 className="text-sm font-semibold text-[var(--color-ink)]">
              How PressZero operates completely offline as a Progressive Web App (PWA)
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-medium bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[var(--color-muted)]">
            Technical explanation
          </span>
        </div>

        <p className="text-xs text-[var(--color-muted)] leading-relaxed max-w-4xl">
          Even though PressZero is accessed via a web browser, it behaves like desktop software. It does not require continuous internet access, and works even when completely disconnected from the network:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <div className="p-4 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-ink)]">
              <Layers className="w-4 h-4 text-[var(--color-ok)]" />
              <span>1. Service worker cache</span>
            </div>
            <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
              On your first visit, the background service worker caches all user interface code, fonts, and worker scripts in local browser storage.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-ink)]">
              <Cpu className="w-4 h-4 text-[var(--color-ok)]" />
              <span>2. Local CPU/GPU compute</span>
            </div>
            <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
              Image quantization and binary search algorithms execute directly using your device hardware through HTML5 Canvas and Web Workers.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-ink)]">
              <WifiOff className="w-4 h-4 text-[var(--color-ok)]" />
              <span>3. Air-gap certified</span>
            </div>
            <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
              You can turn off your Wi-Fi, enable Airplane Mode, or unplug Ethernet cables. PressZero continues compressing with zero degradation.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-ink)]">
              <Smartphone className="w-4 h-4 text-[var(--color-ok)]" />
              <span>4. Standalone app install</span>
            </div>
            <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
              Install PressZero directly to your macOS Dock, Windows Start Menu, or mobile home screen as a standalone application.
            </p>
          </div>
        </div>
      </div>

      {/* Video Modal if opened */}
      {videoModalOpen && (
        <VideoDemoModal
          isOpen={true}
          onClose={() => setVideoModalOpen(false)}
          topic="loupe"
        />
      )}
    </section>
  );
}