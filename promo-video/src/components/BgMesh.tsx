import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";

export const BgMesh: React.FC<{ accentColor?: string }> = ({ accentColor = theme.colors.accentEmerald }) => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 45) * 60;
  const d2 = Math.cos(frame / 60) * 50;
  const d3 = Math.sin(frame / 75) * 40;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, overflow: "hidden" }}>
      {/* Subtle hairline technical grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.7,
        }}
      />

      {/* Primary drifting luminous orb */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          top: -300 + d1,
          left: -200 + d2,
          filter: "blur(110px)",
          background: `radial-gradient(circle, ${accentColor}18, transparent 65%)`,
        }}
      />

      {/* Secondary technical deep orb */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          bottom: -250 - d2,
          right: -180 + d3,
          filter: "blur(130px)",
          background: `radial-gradient(circle, ${theme.colors.accentCyan}15, transparent 68%)`,
        }}
      />

      {/* Center ambient focal spotlight */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          top: "40%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${1 + Math.sin(frame / 30) * 0.05})`,
          filter: "blur(90px)",
          background: "radial-gradient(circle, rgba(255,255,255,0.04), transparent 70%)",
        }}
      />
    </AbsoluteFill>
  );
};
