import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";

export const HudOverlay: React.FC<{ label?: string }> = ({ label = "PRESSZERO · ZERO-EGRESS" }) => {
  const frame = useCurrentFrame();
  const blink = frame % 30 < 15;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", padding: 48, zIndex: 10 }}>
      {/* Top Left Corner Bracket */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 48,
          width: 32,
          height: 32,
          borderTop: "2px solid rgba(255,255,255,0.3)",
          borderLeft: "2px solid rgba(255,255,255,0.3)",
        }}
      />

      {/* Top Right Corner Bracket */}
      <div
        style={{
          position: "absolute",
          top: 48,
          right: 48,
          width: 32,
          height: 32,
          borderTop: "2px solid rgba(255,255,255,0.3)",
          borderRight: "2px solid rgba(255,255,255,0.3)",
        }}
      />

      {/* Bottom Left Corner Bracket */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 48,
          width: 32,
          height: 32,
          borderBottom: "2px solid rgba(255,255,255,0.3)",
          borderLeft: "2px solid rgba(255,255,255,0.3)",
        }}
      />

      {/* Bottom Right Corner Bracket */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          right: 48,
          width: 32,
          height: 32,
          borderBottom: "2px solid rgba(255,255,255,0.3)",
          borderRight: "2px solid rgba(255,255,255,0.3)",
        }}
      />

      {/* Top Center Telemetry Ticker */}
      <div
        style={{
          position: "absolute",
          top: 52,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontFamily: theme.fonts.mono,
          fontSize: 12,
          color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.15em",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: theme.colors.accentEmerald,
            opacity: blink ? 1 : 0.4,
            boxShadow: `0 0 8px ${theme.colors.accentEmerald}`,
          }}
        />
        <span>{label}</span>
      </div>

      {/* Bottom Corner Frame Coordinates */}
      <div
        style={{
          position: "absolute",
          bottom: 52,
          right: 64,
          fontFamily: theme.fonts.mono,
          fontSize: 11,
          color: "rgba(255,255,255,0.4)",
          letterSpacing: "0.08em",
        }}
      >
        FR.{frame.toString().padStart(4, "0")} / 60FPS
      </div>
    </AbsoluteFill>
  );
};
