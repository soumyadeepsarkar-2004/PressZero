import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";

export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.accentEmerald,
        mixBlendMode: "soft-light",
        opacity: 0.12,
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 22%, transparent 78%, rgba(0,0,0,0.35) 100%)",
      }}
    />
  </AbsoluteFill>
);
