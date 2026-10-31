"use client";

import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  ExternalLink, 
  BookOpen, 
  Terminal, 
  Layers, 
  Apple, 
  Monitor, 
  Cpu, 
  CheckCircle2, 
  Activity,
  FileCode2
} from "lucide-react";
import PressZeroLogo from "@/components/common/PressZeroLogo";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--color-rule)] bg-[var(--color-paper-3)] mt-24 text-[var(--color-muted)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[var(--color-rule)]">
          {/* Col 1 & 2: Identity & Privacy Pillar (2 Cols on Desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <PressZeroLogo size={26} showWordmark={true} />
            </Link>

            <p className="text-xs text-[var(--color-muted)] leading-relaxed max-w-sm">
              The client-side, zero-knowledge precision image studio. Reduces photos and signatures to exact kilobyte limits for government portals with verifiable zero bytes network egress.
            </p>

            {/* Live Operational Status Capsule */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-xs text-[var(--color-ink)]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-ok)] motion-safe:animate-pulse" aria-hidden="true" />
              <span className="font-medium">All systems nominal</span>
              <span className="text-[var(--color-rule-2)]" aria-hidden="true">·</span>
              <span className="text-[var(--color-muted)]">0 bytes egress</span>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[var(--color-muted)]">
                v1.0.0 Production
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[var(--color-muted)]">
                MIT License
              </span>
            </div>
          </div>

          {/* Col 3: Products & Distributions */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-[var(--color-ink)]">
              Products
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/studio" className="hover:text-[var(--color-ink)] transition-colors flex items-center gap-1.5">
                  <span>Web Studio</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-[var(--color-paper-2)] text-[var(--color-ok)] border border-[var(--color-rule)]">Live</span>
                </Link>
              </li>
              <li>
                <Link href="/download" className="hover:text-[var(--color-ink)] transition-colors flex items-center gap-1.5">
                  <Apple className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>macOS Universal (.ZIP)</span>
                </Link>
              </li>
              <li>
                <Link href="/download" className="hover:text-[var(--color-ink)] transition-colors flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Windows Setup (.EXE)</span>
                </Link>
              </li>
              <li>
                <Link href="/download" className="hover:text-[var(--color-ink)] transition-colors flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Progressive Web App</span>
                </Link>
              </li>
              <li>
                <Link href="/api/health" target="_blank" className="hover:text-[var(--color-ink)] transition-colors flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[var(--color-ok)]" aria-hidden="true" />
                  <span>Telemetry (/api/health)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Standards & Form Specifications */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-[var(--color-ink)]">
              Compliance standards
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/#portal-matrix" className="hover:text-[var(--color-ink)] transition-colors">
                  UPSC Civil Services (20–50 KB)
                </Link>
              </li>
              <li>
                <Link href="/#portal-matrix" className="hover:text-[var(--color-ink)] transition-colors">
                  NTA / UGC-NET (10–200 KB)
                </Link>
              </li>
              <li>
                <Link href="/#portal-matrix" className="hover:text-[var(--color-ink)] transition-colors">
                  US Visa DS-160 (600×600 px)
                </Link>
              </li>
              <li>
                <Link href="/#portal-matrix" className="hover:text-[var(--color-ink)] transition-colors">
                  Schengen Biometrics (35×45 mm)
                </Link>
              </li>
              <li>
                <Link href="/#portal-matrix" className="hover:text-[var(--color-ink)] transition-colors">
                  Signature Bleach &amp; Contrast
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Documentation & Open Source */}
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-[var(--color-ink)]">
              Documentation &amp; AI
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/docs" className="hover:text-[var(--color-ink)] transition-colors flex items-center gap-1.5 text-[var(--color-ink)] font-medium">
                  <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Developer documentation</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/soumyadeepsarkar-2004/PressZero"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--color-ink)] transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>GitHub repository</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/soumyadeepsarkar-2004/PressZero/releases/tag/v1.0.0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--color-ink)] transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>GitHub releases (v1.0.0)</span>
                </a>
              </li>
              <li>
                <Link href="/llms.txt" target="_blank" className="hover:text-[var(--color-ink)] transition-colors flex items-center gap-1.5">
                  <FileCode2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>LLM agent index (llms.txt)</span>
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" target="_blank" className="hover:text-[var(--color-ink)] transition-colors">
                  <span>XML sitemap</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Utility Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--color-muted)] gap-4">
          <p>© 2026 PressZero. 100% on-device client compute.</p>

          <div className="flex items-center gap-6">
            <Link href="/docs" className="hover:text-[var(--color-ink)] transition-colors">
              Docs
            </Link>
            <Link href="/download" className="hover:text-[var(--color-ink)] transition-colors">
              Downloads
            </Link>
            <Link href="/#privacy-manifesto" className="hover:text-[var(--color-ink)] transition-colors">
              Privacy manifesto
            </Link>
            <Link href="/llms.txt" className="hover:text-[var(--color-ink)] transition-colors">
              llms.txt
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
