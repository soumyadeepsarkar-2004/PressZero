"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sliders, 
  FileSignature, 
  ShieldCheck, 
  ChevronDown, 
  ArrowRight, 
  Check, 
  Layers,
  Sparkles,
  HelpCircle
} from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  keywords: string[];
}

const FAQS: FaqItem[] = [
  {
    question: "How do I reduce image size to an exact KB limit (like 20 KB or 50 KB)?",
    answer: "Traditional tools only provide percentage sliders (e.g. 70%), forcing repeated trial-and-error. PressZero uses a dual-axis binary search bisection algorithm: you enter your target kilobyte limit (for example 50 KB for UPSC or 20 KB for NTA), and the in-memory engine calculates the exact quantization matrix in under 25ms to hit within ±2% of that ceiling.",
    keywords: ["image reducer", "compress image to 50kb", "exact kb compressor"]
  },
  {
    question: "What is an image resizer with signature bleaching?",
    answer: "When you take a picture of a paper signature with a smartphone, it often contains phone shadows, paper grain, and yellow ambient lighting. Government portals automatically reject these. PressZero's adaptive bleach filter computes ITU-R BT.601 pixel luminance, wiping shadows to pure #FFFFFF white while boosting pen ink contrast.",
    keywords: ["signature resizer", "signature bleach filter", "white background signature"]
  },
  {
    question: "Is this image reducer safe for sensitive documents like passports and national IDs?",
    answer: "Yes, 100%. PressZero is engineered with a strict zero-knowledge architecture. All image resizing, compression, and biometric cropping execute exclusively inside your device memory (HTML5 Canvas and Web Workers). Exactly 0 bytes are transmitted across the internet, completely eliminating data leak risks.",
    keywords: ["zero knowledge image compressor", "private image reducer", "offline photo resizer"]
  },
  {
    question: "Can I use PressZero as an offline image reducer without internet?",
    answer: "Yes. You can install PressZero as a Progressive Web App (PWA) directly from your browser, or download our standalone native executables: PressZero-Setup.exe for Windows 10/11 or PressZero.app for macOS (Apple Silicon & Intel). Both work completely disconnected from the internet in full air-gap mode.",
    keywords: ["offline image reducer", "windows image compressor", "macos image resizer"]
  },
  {
    question: "Which government exam and visa portals are supported?",
    answer: "PressZero has pre-calibrated presets for UPSC Civil Services (20–50 KB photo, 10–20 KB signature), NTA NEET/JEE/UGC-NET (10–200 KB photo, 4–30 KB signature), SSC Staff Selection Commission, US Visa DS-160 (600x600 px under 240 KB), Schengen Biometric Visas (35x45 mm), and Indian Passport Seva.",
    keywords: ["upsc photo resizer", "nta photo compressor", "us visa photo resizer"]
  }
];

export default function SeoKnowledgeHub() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="py-20 border-t border-[var(--color-rule)] bg-[var(--color-paper-2)]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Masthead */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-medium bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[var(--color-ink)]">
            <Sliders className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Universal image reducer &amp; resizer engine</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[var(--color-ink)]">
            Every image size, ratio, and format reduced with precision.
          </h2>

          <p className="text-sm sm:text-base text-[var(--color-muted)] leading-relaxed">
            Whether you need a quick 50 KB photo reducer for an exam portal, an exact 600×600 px image resizer for a visa application, or an offline batch compressor, PressZero delivers exact byte compliance.
          </p>
        </div>

        {/* 3-Column Capability Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Exact Target KB Reducer */}
          <div className="p-6 rounded-xl panel-console border border-[var(--color-rule)] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-ink)]">
                <Sliders className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-[var(--color-ink)]">
                Exact-KB Image Reducer
              </h3>
              <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                Input any target ceiling from 2 KB to 5000 KB. The bisection algorithm iteratively converges in milliseconds to land right below portal byte bounds without visual degradation.
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--color-rule)] space-y-1.5 text-[11px] text-[var(--color-muted)]">
              <div className="flex items-center justify-between">
                <span>Micro targets:</span>
                <span className="text-[var(--color-ink)] font-medium">4 KB, 15 KB, 20 KB</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Standard targets:</span>
                <span className="text-[var(--color-ink)] font-medium">50 KB, 100 KB, 200 KB</span>
              </div>
            </div>
          </div>

          {/* Card 2: Biometric Ratio & Crop Resizer */}
          <div className="p-6 rounded-xl panel-console border border-[var(--color-rule)] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-ink)]">
                <Layers className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-[var(--color-ink)]">
                Biometric Image Resizer
              </h3>
              <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                Enforce exact aspect ratios and dimension matrices before compressing. Features built-in 7:9 (3.5×4.5 cm), 1:1 square (600×600 px), and 7:3 signature templates.
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--color-rule)] space-y-1.5 text-[11px] text-[var(--color-muted)]">
              <div className="flex items-center justify-between">
                <span>UPSC / NTA standard:</span>
                <span className="text-[var(--color-ink)] font-medium">350×450 px (7:9)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>US Visa DS-160:</span>
                <span className="text-[var(--color-ink)] font-medium">600×600 px (1:1)</span>
              </div>
            </div>
          </div>

          {/* Card 3: Adaptive Signature Bleach */}
          <div className="p-6 rounded-xl panel-console border border-[var(--color-rule)] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-ink)]">
                <FileSignature className="w-4 h-4" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-[var(--color-ink)]">
                Signature Bleach &amp; Enhancer
              </h3>
              <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                Eliminate smartphone yellow lighting, table reflections, and camera shadows. Locks signature background to pure white while boosting ink darkness for OCR verification.
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--color-rule)] space-y-1.5 text-[11px] text-[var(--color-muted)]">
              <div className="flex items-center justify-between">
                <span>Background tone:</span>
                <span className="text-[var(--color-ok)] font-medium">Pure #FFFFFF</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Portal acceptance:</span>
                <span className="text-[var(--color-ok)] font-medium">100% verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Structured SEO FAQ Accordion */}
        <div className="p-6 sm:p-8 rounded-xl panel-console border border-[var(--color-rule)] space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-[var(--color-rule)]">
            <HelpCircle className="w-4 h-4 text-[var(--color-ink)]" aria-hidden="true" />
            <h3 className="text-base font-semibold text-[var(--color-ink)]">
              Frequently asked questions · Image reducer &amp; resizer
            </h3>
          </div>

          <div className="divide-y divide-[var(--color-rule)]">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between gap-4 text-left cursor-pointer active:scale-98 group"
                  >
                    <span className="text-sm font-medium text-[var(--color-ink)] group-hover:text-[var(--color-ink)]">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[var(--color-muted)] transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180 text-[var(--color-ink)]" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isOpen && (
                    <div className="mt-3 text-xs text-[var(--color-muted)] leading-relaxed pr-8">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
