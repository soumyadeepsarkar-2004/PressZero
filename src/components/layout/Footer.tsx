import React from "react";
import Link from "next/link";
import { ShieldCheck, FileCode2, ExternalLink, Cpu } from "lucide-react";
import PressZeroLogo from "@/components/common/PressZeroLogo";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--color-rule)] bg-[var(--color-paper-3)] mt-20 text-[var(--color-muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Identity & Security Assurance */}
          <div className="md:col-span-1 space-y-4">
            <PressZeroLogo size={26} showWordmark={true} />
            <p className="text-xs text-[var(--color-muted)] leading-relaxed">
              Target-exact, zero-knowledge image reducer. Engineered for strict government exam portals, visa document constraints, and high-speed web vitals.
            </p>
            <div className="flex items-center gap-2 text-xs text-[var(--color-ok)] font-normal">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero server storage verified</span>
            </div>
          </div>

          {/* Col 2: Core Portals & Presets */}
          <div>
            <h4 className="text-xs font-semibold text-[var(--color-ink)] mb-3 tracking-wide">Portal matrix</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="#portal-matrix" className="hover:text-[var(--color-ink)] transition-colors">
                  NTA / UGC-NET signature (10 to 50 KB)
                </Link>
              </li>
              <li>
                <Link href="#portal-matrix" className="hover:text-[var(--color-ink)] transition-colors">
                  NTA photograph (10 to 200 KB)
                </Link>
              </li>
              <li>
                <Link href="#portal-matrix" className="hover:text-[var(--color-ink)] transition-colors">
                  UPSC Civil Services photo & signature
                </Link>
              </li>
              <li>
                <Link href="#portal-matrix" className="hover:text-[var(--color-ink)] transition-colors">
                  US Visa DS-160 (600x600 px)
                </Link>
              </li>
              <li>
                <Link href="#portal-matrix" className="hover:text-[var(--color-ink)] transition-colors">
                  Schengen biometric photo (35x45 mm)
                </Link>
              </li>
              <li>
                <Link href="#portal-matrix" className="hover:text-[var(--color-ink)] transition-colors">
                  Ultra micro (2 to 5 KB)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: AI & Developer Index (SEO Internal Form Factors) */}
          <div>
            <h4 className="text-xs font-semibold text-[var(--color-ink)] mb-3 tracking-wide">Developer & AI index</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/download" className="hover:text-[var(--color-ink)] transition-colors">
                  Desktop app (Windows x64 & PWA)
                </Link>
              </li>
              <li>
                <Link href="/api/health" target="_blank" className="hover:text-[var(--color-ink)] transition-colors">
                  System health API (/api/health)
                </Link>
              </li>
              <li>
                <Link href="/llms.txt" target="_blank" className="hover:text-[var(--color-ink)] transition-colors flex items-center gap-1.5">
                  <FileCode2 className="w-3.5 h-3.5 text-[var(--color-ink)]" />
                  <span>llms.txt (Jeremy Howard format)</span>
                </Link>
              </li>
              <li>
                <Link href="/llms-full.txt" target="_blank" className="hover:text-[var(--color-ink)] transition-colors flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-[var(--color-muted)]" />
                  <span>llms-full.txt (monolithic index)</span>
                </Link>
              </li>
              <li>
                <Link href="/robots.txt" target="_blank" className="hover:text-[var(--color-ink)] transition-colors">
                  robots.txt (AI crawlers allowed)
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" target="_blank" className="hover:text-[var(--color-ink)] transition-colors">
                  sitemap.xml
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Zero-Knowledge Verification */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[var(--color-ink)] mb-2 tracking-wide">Local compute proof</h4>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed">
              Every pixel calculation, bleach filter, and compression pass executes entirely within your browser&apos;s WebAssembly / HTML5 canvas pipeline.
            </p>
            <div className="p-3 rounded-lg panel-console border border-[var(--color-rule)] text-xs text-[var(--color-muted)] space-y-1">
              <div className="flex items-center gap-1.5 text-[var(--color-ink)] font-medium">
                <Cpu className="w-3.5 h-3.5" />
                <span>Client compute only</span>
              </div>
              <p className="text-[11px]">
                Network egress is mathematically 0 bytes. Inspect dev tools network tab to verify.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--color-rule)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--color-muted)] gap-4">
          <p>© 2026 PressZero. Client-side, zero-knowledge image reducer.</p>
          <div className="flex items-center gap-4">
            <Link href="#privacy-manifesto" className="hover:text-[var(--color-ink)] transition-colors">
              Privacy statement
            </Link>
            <Link href="/llms.txt" className="hover:text-[var(--color-ink)] transition-colors">
              AI index
            </Link>
            <Link href="/studio" className="hover:text-[var(--color-ink)] transition-colors">
              Studio app
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
