import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { theme } from "../theme";

interface ApertureLogoProps {
  size?: number;
  delay?: number;
  showWordmark?: boolean;
}

export const ApertureLogo: React.FC<ApertureLogoProps> = ({
  size = 180,
  delay = 0,
  showWordmark = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for logo container
  const pop = spring({
    frame: frame - delay,
    fps,
    config: theme.spring.bouncy,
  });

  const scale = interpolate(pop, [0, 1], [0.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(pop, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Calipers slide inward to compress
  const caliperProgress = spring({
    frame: frame - delay - 6,
    fps,
    config: { damping: 12, stiffness: 140, mass: 0.8 },
  });

  const leftCaliperX = interpolate(caliperProgress, [0, 1], [-20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rightCaliperX = interpolate(caliperProgress, [0, 1], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Continuous subtle rotation of the outer precision track
  const rotation = (frame * 0.4) % 360;

  // Breathing pulse of the central aperture
  const pulse = 1 + Math.sin(frame / 12) * 0.08;

  // Wordmark delayed reveal
  const wordmarkPop = spring({
    frame: frame - delay - 10,
    fps,
    config: theme.spring.snappy,
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: size,
          height: size,
          filter: `drop-shadow(0 0 32px ${theme.colors.emeraldGlow})`,
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base rounded squircle container */}
          <rect
            width="120"
            height="120"
            rx="28"
            fill="#121217"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="2.5"
          />

          {/* Rotating dashed precision track */}
          <g transform={`rotate(${rotation} 60 60)`}>
            <ellipse
              cx="60"
              cy="60"
              rx="36"
              ry="44"
              stroke={theme.colors.accentEmerald}
              strokeWidth="2.5"
              strokeDasharray="140 25"
              strokeLinecap="round"
            />
          </g>

          {/* Inner measurement scale */}
          <ellipse
            cx="60"
            cy="60"
            rx="22"
            ry="30"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.8"
            strokeDasharray="6 6"
          />

          {/* Left compression caliper */}
          <g transform={`translate(${leftCaliperX}, 0)`}>
            <path
              d="M 22 60 L 48 60 M 42 52 L 48 60 L 42 68"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Right compression caliper */}
          <g transform={`translate(${rightCaliperX}, 0)`}>
            <path
              d="M 98 60 L 72 60 M 78 52 L 72 60 L 78 68"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Central zero-tolerance focal aperture */}
          <circle
            cx="60"
            cy="60"
            r={5.5 * pulse}
            fill={theme.colors.accentEmerald}
          />
          <circle
            cx="60"
            cy="60"
            r={10 * pulse}
            stroke={theme.colors.accentEmerald}
            strokeWidth="1.8"
            strokeOpacity="0.6"
          />
        </svg>
      </div>

      {showWordmark && (
        <div
          style={{
            opacity: wordmarkPop,
            transform: `translateY(${interpolate(wordmarkPop, [0, 1], [18, 0])}px)`,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span
            style={{
              fontSize: size * 0.28,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "#FFFFFF",
              fontFamily: theme.fonts.display,
            }}
          >
            Press<span style={{ color: theme.colors.textMuted, fontWeight: 400 }}>Zero</span>
          </span>
        </div>
      )}
    </div>
  );
};
