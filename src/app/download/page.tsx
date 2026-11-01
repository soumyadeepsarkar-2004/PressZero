"use client";

import React, { useState, useEffect } from "react";
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
  FileArchive,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import PressZeroLogo from "@/components/common/PressZeroLogo";
import PwaInstallPrompt from "@/components/layout/PwaInstallPrompt";
import { trackDownload } from "@/lib/telemetry";

const WINDOWS_SETUP_HASH = "2182A5A55BB86E7879317563D59268D1F1556633A920A559EC378F170464084F";
const MACOS_ZIP_HASH = "2D418F304E42D56A805F6B2710BE95FBDF4BBF1959AAFDB6E4718995194BEF7F";

export default function DownloadPage() {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [detectedOs, setDetectedOs] = useState<"mac" | "windows" | "other">("other");
  const [activeGuideTab, setActiveGuideTab] = useState<"mac" | "windows">("mac");

  useEffect(() => {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      const platform = (navigator as unknown as { userAgentData?: { platform?: string } }).userAgentData?.platform || navigator.platform || "";
      const ua = navigator.userAgent || "";
      if (/Mac|iPad|iPhone/i.test(platform) || /Macintosh/i.test(ua)) {
        setDetectedOs("mac");
        setActiveGuideTab("mac");
      } else if (/Win/i.test(platform) || /Windows/i.test(ua)) {
        setDetectedOs("windows");
        setActiveGuideTab("windows");
      }
    }
  }, []);

  const handleCopy = (text: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
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
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Back to overview</span>
            </Link>
            <span className="text-[var(--color-rule-2)]" aria-hidden="true">/</span>
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-16">
        {/* Masthead */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-medium bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[var(--color-ok)]">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Air-gap certified native distributions · macOS & Windows</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[var(--color-ink)] leading-[1.08]">
            Download PressZero desktop software
          </h1>

          <p className="text-base text-[var(--color-muted)] leading-relaxed">
            Run PressZero as a standalone desktop instrument with zero internet connectivity. Available for Apple Silicon &amp; Intel Macs, Windows 64-bit, and Progressive Web App.
          </p>
        </div>

        {/* Operating Systems Distribution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Platform 1: macOS Universal (Apple Silicon & Intel) */}
          <div className={`p-6 sm:p-7 rounded-xl panel-console flex flex-col justify-between relative overflow-hidden transition-colors ${
            detectedOs === "mac" ? "border-2 border-[var(--color-ink)] shadow-md" : "border border-[var(--color-rule)]"
          }`}>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-ink)]">
                  <Apple className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="flex items-center gap-1.5">
                  {detectedOs === "mac" && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--color-ok)]/15 text-[var(--color-ok)] border border-[var(--color-ok)]/30">
                      Your Mac
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--color-ink)] text-[var(--color-accent-ink)]">
                    Official v1.0
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[var(--color-ink)] flex items-center gap-2">
                  <span>macOS Universal</span>
                </h3>
                <p className="text-xs text-[var(--color-muted)] mt-1 leading-relaxed">
                  Native bundle for Apple Silicon (M1/M2/M3/M4) and Intel Macs. Includes one-click terminal runner.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href="/downloads/PressZero-macOS-Universal.zip"
                  download="PressZero-macOS-Universal.zip"
                  onClick={() => trackDownload()}
                  className="w-full btn-primary py-2.5 px-4 text-xs font-medium flex items-center justify-center gap-2 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)] whitespace-nowrap"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  <span className="whitespace-nowrap">Download macOS (.ZIP)</span>
                </a>

                <button
                  type="button"
                  onClick={() => setActiveGuideTab("mac")}
                  className="w-full btn-ghost py-2 px-3 text-xs font-medium flex items-center justify-center gap-1.5 border border-[var(--color-rule-2)] cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)] text-[var(--color-muted)] hover:text-[var(--color-ink)] whitespace-nowrap"
                >
                  <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>View Mac install guide</span>
                </button>
              </div>

              <div className="space-y-2 pt-2 border-t border-[var(--color-rule)] text-[11px] text-[var(--color-muted)]">
                <div className="flex items-center justify-between">
                  <span>Chipset:</span>
                  <span className="text-[var(--color-ink)] font-medium">Apple Silicon &amp; Intel</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>macOS target:</span>
                  <span className="text-[var(--color-ink)]">macOS 11.0 to 15+</span>
                </div>
              </div>
            </div>

            {/* Checksum Box */}
            <div className="mt-6 pt-3 border-t border-[var(--color-rule)] space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-[var(--color-muted)]">
                <span>SHA-256 (macOS ZIP):</span>
                <button
                  type="button"
                  onClick={() => handleCopy(MACOS_ZIP_HASH, "mac")}
                  className="flex items-center gap-1 hover:text-[var(--color-ink)] cursor-pointer active:scale-98"
                >
                  {copiedHash === "mac" ? (
                    <Check className="w-3 h-3 text-[var(--color-ok)]" aria-hidden="true" />
                  ) : (
                    <Copy className="w-3 h-3" aria-hidden="true" />
                  )}
                  <span>{copiedHash === "mac" ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <div className="p-1.5 rounded bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[9px] font-mono text-[var(--color-muted)] truncate select-all">
                {MACOS_ZIP_HASH}
              </div>
            </div>
          </div>

          {/* Platform 2: Windows (Primary / Ready) */}
          <div className={`p-6 sm:p-7 rounded-xl panel-console flex flex-col justify-between relative overflow-hidden transition-colors ${
            detectedOs === "windows" ? "border-2 border-[var(--color-ink)] shadow-md" : "border border-[var(--color-rule)]"
          }`}>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-ink)]">
                  <Monitor className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="flex items-center gap-1.5">
                  {detectedOs === "windows" && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--color-ok)]/15 text-[var(--color-ok)] border border-[var(--color-ok)]/30">
                      Your PC
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--color-ink)] text-[var(--color-accent-ink)]">
                    Official v1.0
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[var(--color-ink)]">
                  Windows 64-bit
                </h3>
                <p className="text-xs text-[var(--color-muted)] mt-1 leading-relaxed">
                  Portable executable package for Windows 10 &amp; 11. No administrator rights required.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href="/downloads/PressZero-Setup.exe"
                  download="PressZero-Setup.exe"
                  onClick={() => trackDownload()}
                  className="w-full btn-primary py-2.5 px-4 text-xs font-medium flex items-center justify-center gap-2 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)] whitespace-nowrap"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  <span className="whitespace-nowrap">Windows setup (.EXE)</span>
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="/downloads/PressZero-Windows-x64.zip"
                    download="PressZero-Windows-x64.zip"
                    onClick={() => trackDownload()}
                    className="btn-ghost py-2 px-3 text-xs font-medium flex items-center justify-center gap-1.5 border border-[var(--color-rule-2)] cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)] whitespace-nowrap"
                  >
                    <FileArchive className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Software pack</span>
                  </a>

                  <a
                    href="/downloads/PressZero.exe"
                    download="PressZero.exe"
                    onClick={() => trackDownload()}
                    className="btn-ghost py-2 px-3 text-xs font-medium flex items-center justify-center gap-1.5 border border-[var(--color-rule-2)] cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)] whitespace-nowrap"
                  >
                    <Monitor className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Portable .EXE</span>
                  </a>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[var(--color-rule)] text-[11px] text-[var(--color-muted)]">
                <div className="flex items-center justify-between">
                  <span>Architecture:</span>
                  <span className="text-[var(--color-ink)] font-medium">x86_64</span>
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
                  type="button"
                  onClick={() => handleCopy(WINDOWS_SETUP_HASH, "setup")}
                  className="flex items-center gap-1 hover:text-[var(--color-ink)] cursor-pointer active:scale-98"
                >
                  {copiedHash === "setup" ? (
                    <Check className="w-3 h-3 text-[var(--color-ok)]" aria-hidden="true" />
                  ) : (
                    <Copy className="w-3 h-3" aria-hidden="true" />
                  )}
                  <span>{copiedHash === "setup" ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <div className="p-1.5 rounded bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[9px] font-mono text-[var(--color-muted)] truncate select-all">
                {WINDOWS_SETUP_HASH}
              </div>
            </div>
          </div>

          {/* Platform 3: Universal PWA Desktop App */}
          <div className="p-6 sm:p-7 rounded-xl panel-console border border-[var(--color-rule)] flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-ok)]">
                  <Layers className="w-5 h-5" aria-hidden="true" />
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
                  Install directly from your browser to your macOS Dock, Windows Taskbar, or Linux launcher.
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
                  <span>Air-gap test:</span>
                  <span className="text-[var(--color-ok)]">100% offline verified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Compatibility:</span>
                  <span className="text-[var(--color-ink)]">macOS, Windows, Linux</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-[var(--color-rule)] text-[11px] text-[var(--color-muted)]">
              Supported on Safari, Chrome, Edge, Brave, and Firefox.
            </div>
          </div>
        </div>

        {/* Dedicated Quick-Start Guides (macOS / Windows Switcher) */}
        <div className="p-6 sm:p-8 rounded-xl panel-console border border-[var(--color-rule)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-rule)]">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[var(--color-ink)]" aria-hidden="true" />
              <h2 className="text-base font-semibold text-[var(--color-ink)]">
                Installation &amp; setup walkthrough
              </h2>
            </div>

            <div className="inline-flex rounded-lg border border-[var(--color-rule)] p-0.5 bg-[var(--color-paper-2)] self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveGuideTab("mac")}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeGuideTab === "mac" 
                    ? "bg-[var(--color-ink)] text-[var(--color-accent-ink)]" 
                    : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                }`}
              >
                <Apple className="w-3.5 h-3.5" aria-hidden="true" />
                <span>macOS Guide</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveGuideTab("windows")}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeGuideTab === "windows" 
                    ? "bg-[var(--color-ink)] text-[var(--color-accent-ink)]" 
                    : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Windows Guide</span>
              </button>
            </div>
          </div>

          {activeGuideTab === "mac" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="p-4 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-2">
                <div className="w-6 h-6 rounded bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center font-medium text-[var(--color-ink)]">
                  1
                </div>
                <h4 className="text-sm font-medium text-[var(--color-ink)]">Extract zip archive</h4>
                <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
                  Download <span className="text-[var(--color-ink)] font-medium">PressZero-macOS-Universal.zip</span> and double-click to expand the folder containing <span className="text-[var(--color-ink)] font-medium">PressZero.app</span>.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-2">
                <div className="w-6 h-6 rounded bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center font-medium text-[var(--color-ink)]">
                  2
                </div>
                <h4 className="text-sm font-medium text-[var(--color-ink)]">Run installer or move</h4>
                <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
                  Double-click <span className="text-[var(--color-ink)] font-medium">Install-PressZero.command</span> to install automatically, or manually drag <span className="text-[var(--color-ink)] font-medium">PressZero.app</span> into <span className="text-[var(--color-ink)] font-medium">/Applications</span>.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-2">
                <div className="w-6 h-6 rounded bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center font-medium text-[var(--color-ink)]">
                  3
                </div>
                <h4 className="text-sm font-medium text-[var(--color-ink)]">Launch via Spotlight</h4>
                <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-paper-3)] border border-[var(--color-rule)] font-mono text-[var(--color-ink)]">⌘ + Space</kbd>, type PressZero, and press Enter to launch with zero-egress offline security.
                </p>
              </div>

              {/* Mac Gatekeeper Notice */}
              <div className="md:col-span-3 p-4 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-medium text-[var(--color-ink)] block">
                    macOS Gatekeeper tip:
                  </span>
                  <p className="text-[11px] text-[var(--color-muted)]">
                    If macOS shows a developer prompt, right-click <span className="text-[var(--color-ink)]">PressZero.app</span> &rarr; Open, or run in Terminal:
                  </p>
                </div>
                <div className="flex items-center gap-2 self-stretch sm:self-auto">
                  <code className="px-2 py-1 rounded bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[11px] font-mono text-[var(--color-ink)] select-all truncate">
                    xattr -cr /Applications/PressZero.app
                  </code>
                  <button
                    type="button"
                    onClick={() => handleCopy("xattr -cr /Applications/PressZero.app", "xattr")}
                    className="p-1.5 rounded hover:bg-[var(--color-paper-2)] text-[var(--color-muted)] hover:text-[var(--color-ink)] cursor-pointer active:scale-98"
                    title="Copy command"
                  >
                    {copiedHash === "xattr" ? (
                      <Check className="w-4 h-4 text-[var(--color-ok)]" aria-hidden="true" />
                    ) : (
                      <Copy className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="p-4 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-2">
                <div className="w-6 h-6 rounded bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center font-medium text-[var(--color-ink)]">
                  1
                </div>
                <h4 className="text-sm font-medium text-[var(--color-ink)]">Download PressZero-Setup</h4>
                <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
                  Download the 34 KB <span className="text-[var(--color-ink)] font-medium">PressZero-Setup.exe</span> directly onto your Windows 10 or 11 machine.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-2">
                <div className="w-6 h-6 rounded bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center font-medium text-[var(--color-ink)]">
                  2
                </div>
                <h4 className="text-sm font-medium text-[var(--color-ink)]">Per-user installation</h4>
                <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
                  Double-click to install. It deploys to your user profile directory without requesting administrator UAC prompts.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-2">
                <div className="w-6 h-6 rounded bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center font-medium text-[var(--color-ink)]">
                  3
                </div>
                <h4 className="text-sm font-medium text-[var(--color-ink)]">Desktop &amp; Start shortcuts</h4>
                <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
                  Shortcuts are automatically generated on your Desktop and Start Menu for instant offline access.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Technical Architecture Comparison */}
        <div className="p-6 sm:p-8 rounded-xl panel-console border border-[var(--color-rule)] space-y-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-ok)]" aria-hidden="true" />
            <h2 className="text-base font-semibold text-[var(--color-ink)]">
              Technical specifications &amp; security model
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
            <span className="text-[var(--color-muted)]">· Desktop Edition v1.0 (macOS &amp; Windows)</span>
          </div>
          <div>
            <span>100% Client-Side Execution · Verified 0 bytes network egress</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
