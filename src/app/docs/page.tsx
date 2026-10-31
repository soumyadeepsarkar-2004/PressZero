"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  BookOpen, 
  ShieldCheck, 
  Sliders, 
  FileSignature, 
  Monitor, 
  Activity, 
  Globe, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronRight,
  Terminal,
  Cpu
} from "lucide-react";
import PressZeroLogo from "@/components/common/PressZeroLogo";

interface DocSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  category: string;
  summary: string;
}

const DOC_SECTIONS: DocSection[] = [
  {
    id: "overview",
    title: "System Architecture",
    icon: <Cpu className="w-4 h-4" aria-hidden="true" />,
    category: "Core Engine",
    summary: "100% client-side in-memory topology and verifiable 0-byte network egress guarantee."
  },
  {
    id: "bisection",
    title: "Binary Bisection Engine",
    icon: <Sliders className="w-4 h-4" aria-hidden="true" />,
    category: "Algorithm",
    summary: "Dual-axis binary search quantization algorithm converging within ±2% tolerance in <25ms."
  },
  {
    id: "bleaching",
    title: "Signature Bleach Filter",
    icon: <FileSignature className="w-4 h-4" aria-hidden="true" />,
    category: "Computer Vision",
    summary: "Adaptive luminance thresholding stripping desk shadows and normalizing paper to #FFFFFF."
  },
  {
    id: "portals",
    title: "Portal Compliance Matrix",
    icon: <Globe className="w-4 h-4" aria-hidden="true" />,
    category: "Specifications",
    summary: "Official dimension, DPI, and kilobyte constraints for UPSC, NTA, SSC, US Visa, and Schengen."
  },
  {
    id: "desktop",
    title: "Desktop Native Apps",
    icon: <Monitor className="w-4 h-4" aria-hidden="true" />,
    category: "Distributions",
    summary: "Standalone Windows C# runner (.exe) and macOS Universal bundle (.app) specifications."
  },
  {
    id: "api",
    title: "API Health Telemetry",
    icon: <Activity className="w-4 h-4" aria-hidden="true" />,
    category: "Monitoring",
    summary: "JSON telemetry schema at /api/health for container probes and uptime monitors."
  }
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-paper)]">
      {/* Top Utility Header */}
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
            <span className="text-[var(--color-ink)] font-medium">Developer documentation</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/soumyadeepsarkar-2004/PressZero"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 border border-[var(--color-rule)] cursor-pointer active:scale-98"
            >
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              <span>GitHub</span>
            </a>
            <Link
              href="/studio"
              className="btn-primary px-3.5 py-1.5 text-xs font-medium cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
            >
              <span>Launch studio</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Layout: 2 Columns */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar Navigation */}
          <aside className="lg:col-span-4 sticky top-20 space-y-4">
            <div className="p-4 rounded-xl panel-console border border-[var(--color-rule)] space-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-ink)] pb-2 border-b border-[var(--color-rule)]">
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                <span>Documentation index</span>
              </div>

              <nav className="space-y-1">
                {DOC_SECTIONS.map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setActiveSection(sec.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer active:scale-98 ${
                      activeSection === sec.id
                        ? "bg-[var(--color-ink)] text-[var(--color-accent-ink)]"
                        : "text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-3)]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {sec.icon}
                      <span>{sec.title}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
                  </button>
                ))}
              </nav>
            </div>

            {/* Quick Specs Callout */}
            <div className="p-4 rounded-xl panel-console border border-[var(--color-rule)] space-y-2 text-xs">
              <span className="text-[11px] font-medium text-[var(--color-ok)] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Zero-Knowledge Certification</span>
              </span>
              <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
                Images are processed entirely inside browser RAM. No servers, telemetry, or cloud storage retention.
              </p>
            </div>
          </aside>

          {/* Right Content Area */}
          <section className="lg:col-span-8 p-6 sm:p-8 rounded-xl panel-console border border-[var(--color-rule)] space-y-8">
            {/* Section 1: System Architecture */}
            {activeSection === "overview" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-[var(--color-muted)] font-medium">Core Engine</span>
                  <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--color-ink)] mt-1">
                    System Architecture &amp; Security Model
                  </h1>
                  <p className="text-sm text-[var(--color-muted)] mt-2 leading-relaxed">
                    PressZero operates entirely in-memory on the client machine with zero network transmission.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] font-mono text-xs text-[var(--color-ink)] overflow-x-auto select-all">
                  <pre className="text-[11px] leading-relaxed">
{`+-------------------------------------------------------------+
| USER DEVICE (Browser or Standalone Desktop App)             |
|                                                             |
| [ File Input ] ---> [ HTML5 Canvas ]                        |
|                            |                                |
|                            v                                |
|                 [ Web Worker Thread Pool ]                  |
|                 |- Binary Search Bisection (O(log n))       |
|                 |- Adaptive Luma Bleach Filter              |
|                 |- EXIF / Geolocation Scrubber              |
|                            |                                |
|                            v                                |
|                 [ In-Memory Blob / ZIP Export ]             |
|                            |                                |
|                            v                                |
|                 [ Local Instant Download ]                  |
+-------------------------------------------------------------+
                             |
                             X (0 Bytes Transmitted)
                             v
               [ Remote Backend Servers ]`}
                  </pre>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-[var(--color-ink)]">
                    Network Egress Verification
                  </h3>
                  <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                    You can independently verify zero network transmission: open Developer Tools (<kbd className="px-1.5 py-0.5 rounded bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[10px] text-[var(--color-ink)]">F12</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[10px] text-[var(--color-ink)]">⌥⌘I</kbd>), switch to the Network tab, and perform a compression. Exactly 0 outgoing HTTP requests are made.
                  </p>
                </div>
              </div>
            )}

            {/* Section 2: Binary Bisection Algorithm */}
            {activeSection === "bisection" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-[var(--color-muted)] font-medium">Algorithm</span>
                  <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--color-ink)] mt-1">
                    Dual-Axis Binary Search Bisection
                  </h1>
                  <p className="text-sm text-[var(--color-muted)] mt-2 leading-relaxed">
                    Instead of guessing percentages, PressZero bisects quality boundaries in logarithmic time, hitting exact kilobyte ceilings with ±2% tolerance in under 25ms.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[var(--color-muted)]">
                    <span>Algorithm Implementation</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(`export async function bisectQuality(canvas, format, targetBytes, maxSteps = 8) {
  let low = 0.01, high = 1.0;
  for (let i = 0; i < maxSteps; i++) {
    const q = (low + high) / 2;
    const blob = await canvasToBlob(canvas, format, q);
    if (blob.size <= targetBytes) low = q;
    else high = q;
  }
}`, "bisection")}
                      className="flex items-center gap-1 hover:text-[var(--color-ink)] cursor-pointer"
                    >
                      {copiedCode === "bisection" ? <Check className="w-3.5 h-3.5 text-[var(--color-ok)]" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
                      <span>{copiedCode === "bisection" ? "Copied" : "Copy code"}</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] font-mono text-[11px] text-[var(--color-ink)] overflow-x-auto">
                    <pre>
{`export async function bisectQuality(
  canvas: HTMLCanvasElement,
  format: "image/jpeg" | "image/webp" | "image/png",
  targetBytes: number,
  maxSteps = 8
): Promise<{ blob: Blob; quality: number; steps: number }> {
  let low = 0.01;
  let high = 1.0;
  let bestBlob: Blob | null = null;

  for (let i = 0; i < maxSteps; i++) {
    const q = (low + high) / 2;
    const blob = await canvasToBlob(canvas, format, q);

    if (blob.size <= targetBytes) {
      bestBlob = blob;
      low = q; // Attempt higher fidelity under ceiling
    } else {
      high = q; // Exceeded ceiling; compress harder
    }

    if (Math.abs(blob.size - targetBytes) / targetBytes < 0.02) {
      return { blob, quality: q, steps: i + 1 };
    }
  }

  return { blob: bestBlob!, quality: low, steps: maxSteps };
}`}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: Signature Bleach */}
            {activeSection === "bleaching" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-[var(--color-muted)] font-medium">Computer Vision</span>
                  <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--color-ink)] mt-1">
                    Signature Bleach &amp; High-Pass Filter
                  </h1>
                  <p className="text-sm text-[var(--color-muted)] mt-2 leading-relaxed">
                    Smartphones capture yellow ambient light and hand shadows on paper. The bleach filter calculates ITU-R BT.601 luminance and clips background noise to pure #FFFFFF while darkening pen ink strokes.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] font-mono text-[11px] text-[var(--color-ink)] overflow-x-auto">
                  <pre>
{`// ITU-R BT.601 Luminance calculation
const luma = 0.299 * r + 0.587 * g + 0.114 * b;

if (luma > threshold) {
  // Bleach background paper to pure white
  data[i] = 255; data[i + 1] = 255; data[i + 2] = 255;
} else {
  // Boost pen strokes contrast
  data[i] = Math.max(0, r * inkBoost);
  data[i + 1] = Math.max(0, g * inkBoost);
  data[i + 2] = Math.max(0, b * inkBoost);
}`}
                  </pre>
                </div>
              </div>
            )}

            {/* Section 4: Portals */}
            {activeSection === "portals" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-[var(--color-muted)] font-medium">Specifications</span>
                  <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--color-ink)] mt-1">
                    Government &amp; Biometric Portal Matrix
                  </h1>
                  <p className="text-sm text-[var(--color-muted)] mt-2 leading-relaxed">
                    Pre-calibrated parameters matching official portals to ensure 100% upload acceptance.
                  </p>
                </div>

                <div className="overflow-x-auto border border-[var(--color-rule)] rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[var(--color-paper-3)] border-b border-[var(--color-rule)] text-[var(--color-ink)] font-medium">
                      <tr>
                        <th className="p-3">Portal / Exam</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Size Bounds</th>
                        <th className="p-3">Dimensions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-rule)] text-[var(--color-muted)]">
                      <tr>
                        <td className="p-3 font-medium text-[var(--color-ink)]">UPSC Civil Services</td>
                        <td className="p-3">Photo</td>
                        <td className="p-3">20 KB to 50 KB</td>
                        <td className="p-3">350×350 px (min)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-[var(--color-ink)]">UPSC Civil Services</td>
                        <td className="p-3">Signature</td>
                        <td className="p-3">10 KB to 20 KB</td>
                        <td className="p-3">350×350 px (min)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-[var(--color-ink)]">NTA / UGC-NET</td>
                        <td className="p-3">Photo</td>
                        <td className="p-3">10 KB to 200 KB</td>
                        <td className="p-3">3.5 × 4.5 cm (7:9)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-[var(--color-ink)]">NTA / UGC-NET</td>
                        <td className="p-3">Signature</td>
                        <td className="p-3">4 KB to 30 KB</td>
                        <td className="p-3">3.5 × 1.5 cm</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium text-[var(--color-ink)]">US Visa DS-160</td>
                        <td className="p-3">Biometric</td>
                        <td className="p-3">&lt; 240 KB</td>
                        <td className="p-3">600 × 600 px (1:1)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Section 5: Desktop Native Apps */}
            {activeSection === "desktop" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-[var(--color-muted)] font-medium">Distributions</span>
                  <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--color-ink)] mt-1">
                    Native Desktop Distributions
                  </h1>
                  <p className="text-sm text-[var(--color-muted)] mt-2 leading-relaxed">
                    Lightweight standalone runners for Windows and macOS, providing dedicated app windows and air-gapped offline capability.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[var(--color-ink)]">Windows Setup (.EXE)</span>
                      <span className="text-[10px] font-semibold text-[var(--color-ok)]">34 KB</span>
                    </div>
                    <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
                      Per-user installer into %LOCALAPPDATA%\Programs\PressZero with Start Menu &amp; Desktop shortcuts. No admin UAC elevation required.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[var(--color-ink)]">macOS Universal (.ZIP)</span>
                      <span className="text-[10px] font-semibold text-[var(--color-ok)]">41 KB</span>
                    </div>
                    <p className="text-[11px] text-[var(--color-muted)] leading-relaxed">
                      Universal package for Apple Silicon (M1 to M4) and Intel Macs with Retina AppIcon.icns and double-clickable Install-PressZero.command.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Section 6: API Health Telemetry */}
            {activeSection === "api" && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-[var(--color-muted)] font-medium">Monitoring</span>
                  <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--color-ink)] mt-1">
                    API Health Telemetry Endpoint
                  </h1>
                  <p className="text-sm text-[var(--color-muted)] mt-2 leading-relaxed">
                    Query <code className="text-[var(--color-ink)] font-mono">/api/health</code> for real-time JSON telemetry and 0-egress proof.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] font-mono text-[11px] text-[var(--color-ink)] overflow-x-auto">
                  <pre>
{`curl -s https://presszero.app/api/health | jq .
{
  "status": "healthy",
  "version": "1.0.0",
  "service": "PressZero Precision Image Compression Engine",
  "architecture": {
    "compute": "client-side-in-memory",
    "zeroKnowledge": true,
    "serverStorageRetentionBytes": 0,
    "networkEgressBytes": 0,
    "workerOffloading": true,
    "airgapCertified": true
  },
  "system": {
    "memoryCheck": "nominal",
    "edgeCacheStatus": "active",
    "pwaManifest": "valid"
  }
}`}
                  </pre>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
