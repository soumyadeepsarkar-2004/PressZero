"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Download, 
  Monitor, 
  Apple, 
  Terminal, 
  ShieldCheck, 
  Check, 
  Copy, 
  ArrowLeft, 
  Sparkles, 
  WifiOff, 
  Cpu, 
  Layers,
  FileArchive
} from "lucide-react";
import PressZeroLogo from "@/components/common/PressZeroLogo";
import PwaInstallPrompt from "@/components/layout/PwaInstallPrompt";

const WINDOWS_SETUP_HASH = "2182A5A55BB86E7879317563D59268D1F1556633A920A559EC378F170464084F";
const WINDOWS_ZIP_HASH = "1C33D92A083DE6F8FD24EF510A0E8A16D40D2093C4347B23DCFEC192AE61B81B";

export default function DownloadPage() {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopyHash = (hash: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(hash);
      setCopiedHash(label);
      setTimeout(() => setCopiedHash(null), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-paper)]">
      {/* Top Utility Bar */}
      <header className="border-b border-[var(--color-rule)] bg-[var(--color-paper-2)]/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-[var(--color-muted)] hover:text-[var(--color-ink)] flex items-center gap-1.5 transition-colors cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to overview</span>
            </Link>
            <span className="text-[var(--color-rule-2)]">/</span>
            <span className="text-[var(--color-ink)] font-medium">Download center</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/studio"
              className="btn-primary px-3.5 py-1.5 text-xs font-medium cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
            >
              <span>Open web studio</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Download Hub Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16">
        {/* Masthead */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-medium bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[var(--color-ok)]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Air-gap certified native distributions</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[var(--color-ink)] leading-[1.08]">
            Download PressZero desktop software
          </h1>

          <p className="text-base text-[var(--color-muted)] leading-relaxed">
            Run PressZero as a standalone desktop instrument with zero internet connectivity. Available now for Windows 64-bit with direct executable and portable software packs.
          </p>
        </div>

        {/* Operating Systems Distribution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Platform 1: Windows (Primary / Ready) */}
          <div className="p-6 sm:p-7 rounded-xl panel-console border-2 border-[var(--color-ink)] flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-ink)]">
                  <Monitor className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--color-ink)] text-[var(--color-accent-ink)]">
                  Official v1.0 (Ready)
                </span>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[var(--color-ink)]">
                  Windows 64-bit
                </h3>
                <p className="text-xs text-[var(--color-muted)] mt-1 leading-relaxed">
                  Portable executable package for Windows 10 & 11. No admin rights or installer required.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href="/downloads/PressZero-Setup.exe"
                  download="PressZero-Setup.exe"
                  className="w-full btn-primary py-2.5 px-4 text-xs font-medium flex items-center justify-center gap-2 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)] whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  <span className="whitespace-nowrap">Windows setup (.EXE)</span>
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="/downloads/PressZero-Windows-x64.zip"
                    download="PressZero-Windows-x64.zip"
                    className="btn-ghost py-2 px-3 text-xs font-medium flex items-center justify-center gap-1.5 border border-[var(--color-rule-2)] cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)] whitespace-nowrap"
                  >
                    <FileArchive className="w-3.5 h-3.5" />
                    <span>Software pack</span>
                  </a>

                  <a
                    href="/downloads/PressZero.exe"
                    download="PressZero.exe"
                    className="btn-ghost py-2 px-3 text-xs font-medium flex items-center justify-center gap-1.5 border border-[var(--color-rule-2)] cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)] whitespace-nowrap"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Portable .EXE</span>
                  </a>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[var(--color-rule)] text-[11px] text-[var(--color-muted)]">
                <div className="flex items-center justify-between">
                  <span>Architecture:</span>
                  <span className="font-mono text-[var(--color-ink)] font-medium">x86_64</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Requirement:</span>
                  <span className="text-[var(--color-ink)]">Windows 10 / 11</span>
                </div>
              </div>
            </div>

            {/* Checksum Box */}
            <div className="mt-6 pt-3 border-t border-[var(--color-rule)] space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-[var(--color-muted)]">
                <span>SHA-256 (Setup .EXE):</span>
                <button
                  onClick={() => handleCopyHash(WINDOWS_SETUP_HASH, "setup")}
                  className="flex items-center gap-1 hover:text-[var(--color-ink)] cursor-pointer active:scale-98"
                >
                  {copiedHash === "setup" ? (
                    <Check className="w-3 h-3 text-[var(--color-ok)]" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedHash === "setup" ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <div className="p-1.5 rounded bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[9px] font-mono text-[var(--color-muted)] truncate select-all">
                {WINDOWS_SETUP_HASH}
              </div>
            </div>
          </div>

          {/* Platform 2: Universal PWA Desktop App */}
          <div className="p-6 sm:p-7 rounded-xl panel-console border border-[var(--color-rule)] flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-ok)]">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[var(--color-ok)]">
                  Universal app
                </span>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[var(--color-ink)]">
                  Progressive Web App
                </h3>
                <p className="text-xs text-[var(--color-muted)] mt-1 leading-relaxed">
                  Install directly from your browser to your Windows Taskbar, macOS Dock, or Linux application drawer.
                </p>
              </div>

              <div className="pt-2">
                <PwaInstallPrompt />
              </div>

              <div className="space-y-2 pt-2 border-t border-[var(--color-rule)] text-[11px] text-[var(--color-muted)]">
                <div className="flex items-center justify-between">
                  <span>Engine:</span>
                  <span className="text-[var(--color-ink)]">Service Worker cache</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Updates:</span>
                  <span className="text-[var(--color-ok)]">Instant & automated</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Air-gap test:</span>
                  <span className="text-[var(--color-ok)]">100% offline verified</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-[var(--color-rule)] text-[11px] text-[var(--color-muted)]">
              Supported on Chrome, Edge, Brave, and Firefox desktop browsers.
            </div>
          </div>

          {/* Platform 3: macOS & Linux (Preview) */}
          <div className="p-6 sm:p-7 rounded-xl panel-console border border-[var(--color-rule)] flex flex-col justify-between opacity-85">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-muted)]">
                  <Apple className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[var(--color-muted)]">
                  In Preview
                </span>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[var(--color-ink)]">
                  macOS & Linux
                </h3>
                <p className="text-xs text-[var(--color-muted)] mt-1 leading-relaxed">
                  Native Apple Silicon (.dmg) and Linux (.AppImage) packages currently in internal security staging.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-1.5">
                <span className="text-[11px] font-medium text-[var(--color-ink)] block">
                  Use Progressive Web App for now
                </span>
                <p className="text-[10px] text-[var(--color-muted)] leading-relaxed">
                  macOS and Linux users can install PressZero via the PWA prompt for identical offline performance.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[var(--color-rule)] text-[11px] text-[var(--color-muted)]">
                <div className="flex items-center justify-between">
                  <span>macOS target:</span>
                  <span className="text-[var(--color-muted)]">Apple Silicon (M1/M2/M3/M4)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Linux target:</span>
                  <span className="text-[var(--color-muted)]">x86_64 AppImage</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-[var(--color-rule)] text-[11px] text-[var(--color-muted)]">
              Scheduled release following Windows production validation.
            </div>
          </div>
        </div>

        {/* Technical Architecture Comparison */}
        <div className="p-6 sm:p-8 rounded-xl panel-console border border-[var(--color-rule)] space-y-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-ok)]" />
            <h2 className="text-base font-semibold text-[var(--color-ink)]">
              Technical specifications & security model
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-1">
              <span className="text-[11px] font-medium text-[var(--color-ink)] block">Zero Egress</span>
              <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
                Neither the web app nor desktop package sends file bytes or telemetry across the internet.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-1">
              <span className="text-[11px] font-medium text-[var(--color-ink)] block">Air-Gap Verified</span>
              <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
                Disconnect your network or unplug Ethernet; the software operates completely uninhibited.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-1">
              <span className="text-[11px] font-medium text-[var(--color-ink)] block">Local CPU Threads</span>
              <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
                Processes batch compression jobs concurrently across your machine&apos;s available processor cores.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-1">
              <span className="text-[11px] font-medium text-[var(--color-ink)] block">No Admin Privileges</span>
              <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
                Runs portably from any directory, user profile, or removable USB storage device.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-rule)] bg-[var(--color-paper-2)] py-8 text-center text-xs text-[var(--color-muted)]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <PressZeroLogo size={22} showWordmark={true} />
            <span className="text-[var(--color-muted)]">· Desktop Edition v1.0</span>
          </div>
          <div>
            <span>100% Client-Side Execution · Verified 0 bytes network egress</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
