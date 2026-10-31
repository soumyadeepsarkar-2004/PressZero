"use client";

import React from "react";

interface PressZeroLogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

export default function PressZeroLogo({ 
  size = 28, 
  showWordmark = true, 
  className = "" 
}: PressZeroLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Geometric Aperture Emblem */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0 transition-transform duration-150 group-hover:scale-105"
      >
        <rect
          width="120"
          height="120"
          rx="28"
          fill="var(--color-paper-3)"
          stroke="var(--color-rule-2)"
          strokeWidth="2"
        />
        {/* Outer Zero Ellipse Track */}
        <ellipse
          cx="60"
          cy="60"
          rx="34"
          ry="42"
          stroke="var(--color-ink)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="160 30"
        />
        {/* Inner Zero Precision Core */}
        <ellipse
          cx="60"
          cy="60"
          rx="20"
          ry="28"
          stroke="var(--color-muted)"
          strokeWidth="2"
          strokeDasharray="8 6"
        />
        {/* Left Compression Caliper / Bisection Blade */}
        <path
          d="M 22 60 L 48 60 M 42 52 L 48 60 L 42 68"
          stroke="var(--color-ink)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Right Compression Caliper / Bisection Blade */}
        <path
          d="M 98 60 L 72 60 M 78 52 L 72 60 L 78 68"
          stroke="var(--color-ink)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Central Zero-Tolerance Focal Aperture */}
        <circle cx="60" cy="60" r="5" fill="var(--color-ink)" />
        <circle
          cx="60"
          cy="60"
          r="9"
          stroke="var(--color-ink)"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />
      </svg>

      {showWordmark && (
        <span className="font-semibold text-sm tracking-tight text-[var(--color-ink)]">
          Press<span className="text-[var(--color-muted)] font-normal">Zero</span>
        </span>
      )}
    </div>
  );
}