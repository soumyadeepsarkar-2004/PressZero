"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PORTAL_PRESETS } from "@/lib/presets/portalMatrix";
import VideoDemoModal from "@/components/common/VideoDemoModal";
import { 
  FileSignature, 
  User, 
  Shield, 
  Globe, 
  Plane, 
  Zap, 
  Minimize2, 
  ArrowUpRight,
  CheckCircle2,
  Sliders,
  Play,
  X
} from "lucide-react";
import { PortalPreset } from "@/types";

interface PortalShowcaseProps {
  onSelectPreset?: (presetId: string) => void;
}

export default function PortalShowcase({ onSelectPreset }: PortalShowcaseProps) {
  const [inspectedPreset, setInspectedPreset] = useState<PortalPreset | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState<boolean>(false);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "PenTool":
      case "FileSignature":
        return <FileSignature className="w-4 h-4 text-[var(--color-ink)]" />;
      case "User":
        return <User className="w-4 h-4 text-[var(--color-ink)]" />;
      case "Shield":
        return <Shield className="w-4 h-4 text-[var(--color-ink)]" />;
      case "Globe":
        return <Globe className="w-4 h-4 text-[var(--color-ink)]" />;
      case "Plane":
        return <Plane className="w-4 h-4 text-[var(--color-ink)]" />;
      case "Zap":
        return <Zap className="w-4 h-4 text-[var(--color-ink)]" />;
      default:
        return <Minimize2 className="w-4 h-4 text-[var(--color-ink)]" />;
    }
  };

  const router = useRouter();

  const handleCardClick = (preset: PortalPreset) => {
    setInspectedPreset(preset);
  };

  const handleApplyPreset = (presetId: string) => {
    if (onSelectPreset) {
      onSelectPreset(presetId);
    }
    router.push(`/studio?preset=${presetId}`);
  };

  return (
    <section id="portal-matrix" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[var(--color-rule)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[var(--color-ink)]">
              Portal matrix
            </span>
            <span className="text-xs text-[var(--color-ok)] flex items-center gap-1 font-normal">
              <CheckCircle2 className="w-3.5 h-3.5" /> 8 government calibrated standards
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--color-ink)] tracking-tight">
            Official exam and visa portal specifications
          </h2>
          <p className="text-sm text-[var(--color-muted)] mt-1.5 leading-relaxed">
            Pre-calibrated bounds for UPSC, NTA, SSC, US Visa, and Schengen. Enforces exact dimensions and byte ceilings before upload.
          </p>
        </div>

        <a
          href="#product-tour"
          className="btn-ghost px-3.5 py-1.5 text-xs font-medium flex items-center gap-1.5 cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
        >
          <Play className="w-3.5 h-3.5" />
          <span>Watch portal video demo</span>
        </a>
      </div>

      {/* Preset Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PORTAL_PRESETS.map((preset) => {
          const isInspected = inspectedPreset?.id === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => handleCardClick(preset)}
              className={`group relative p-5 rounded-xl border cursor-pointer flex flex-col justify-between transition-colors duration-150 ${
                isInspected
                  ? "bg-[var(--color-paper-2)] border-[var(--color-ink)]"
                  : "panel-interactive border-[var(--color-rule)]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center">
                    {getIcon(preset.icon)}
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--color-paper-2)] text-[var(--color-muted)] border border-[var(--color-rule)]">
                    {preset.subTitle}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-ink-2)] transition-colors">
                  {preset.name}
                </h3>
                <p className="text-xs text-[var(--color-muted)] mt-1 line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              <div className="pt-3.5 mt-4 border-t border-[var(--color-rule)] flex items-center justify-between text-xs">
                <span className="text-[var(--color-muted)]">
                  Ceiling: <strong className="text-[var(--color-ink)]"><span className="font-measured">{preset.targetKB}</span> KB</strong>
                </span>
                <span className="font-medium text-[var(--color-ink)] flex items-center gap-1 motion-safe:group-hover:translate-x-0.5 motion-safe:transition-transform">
                  Inspect <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Portal Specification Drawer (When preset is selected/inspected) */}
      {inspectedPreset && (
        <div className="mt-6 p-5 sm:p-6 rounded-xl panel-console border border-[var(--color-rule-2)] animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--color-rule)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-ink)]">
                {getIcon(inspectedPreset.icon)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-[var(--color-ink)]">
                    {inspectedPreset.name} specification
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-[var(--color-paper-2)] border border-[var(--color-rule)] text-[var(--color-ok)]">
                    Ready to calibrate
                  </span>
                </div>
                <p className="text-xs text-[var(--color-muted)] mt-0.5">
                  {inspectedPreset.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => setInspectedPreset(null)}
              className="p-1 rounded text-[var(--color-muted)] hover:text-[var(--color-ink)] cursor-pointer active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
              title="Close specification view"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
            <div className="p-3.5 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-1">
              <span className="text-[11px] text-[var(--color-muted)]">Target ceiling</span>
              <p className="text-sm font-semibold text-[var(--color-ink)]">
                <span className="font-measured">{inspectedPreset.targetKB}</span> KB
              </p>
              <span className="text-[10px] text-[var(--color-muted)] block">
                Allowed range: <span className="font-measured">{inspectedPreset.minKB ?? 10}</span> to <span className="font-measured">{inspectedPreset.maxKB}</span> KB
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-1">
              <span className="text-[11px] text-[var(--color-muted)]">Dimensions & aspect</span>
              <p className="text-sm font-semibold text-[var(--color-ink)]">
                <span className="font-measured">{inspectedPreset.defaultWidth ?? 350}</span> × <span className="font-measured">{inspectedPreset.defaultHeight ?? 450}</span> px
              </p>
              <span className="text-[10px] text-[var(--color-muted)] block">
                Ratio: <span className="font-measured">{inspectedPreset.aspectRatio ? inspectedPreset.aspectRatio.toFixed(2) : "1.00"}</span>:1
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)] space-y-1">
              <span className="text-[11px] text-[var(--color-muted)]">Enhancement filter</span>
              <p className="text-sm font-semibold text-[var(--color-ink)]">
                {inspectedPreset.requiresSignatureEnhance ? "Bleach enabled" : "Standard color profile"}
              </p>
              <span className="text-[10px] text-[var(--color-muted)] block">
                Format: {inspectedPreset.format.split("/")[1].toUpperCase()}
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-[var(--color-muted)] flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-ok)]" />
              <span>Calibrating with this preset sets the studio target ceiling automatically.</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setVideoModalOpen(true)}
                className="btn-ghost px-3.5 py-1.5 text-xs font-medium cursor-pointer flex-1 sm:flex-initial text-center active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)] flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 text-[var(--color-ok)]" />
                <span>Watch portal video</span>
              </button>
              <button
                onClick={() => handleApplyPreset(inspectedPreset.id)}
                className="btn-primary px-4 py-1.5 text-xs font-medium cursor-pointer flex-1 sm:flex-initial text-center active:scale-98 focus-visible:outline-2 focus-visible:outline-[var(--color-ink)]"
              >
                <span>Apply in studio</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal if opened */}
      {videoModalOpen && (
        <VideoDemoModal
          isOpen={true}
          onClose={() => setVideoModalOpen(false)}
          topic="cropper"
        />
      )}
    </section>
  );
}