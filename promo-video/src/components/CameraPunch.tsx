import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface CameraPunchProps {
  hitFrames?: number[];
  children: React.ReactNode;
}

export const CameraPunch: React.FC<CameraPunchProps> = ({ hitFrames = [], children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find the most recent hit frame
  const pastHits = hitFrames.filter((hf) => frame >= hf);
  const lastHit = pastHits.length > 0 ? pastHits[pastHits.length - 1] : -999;
  const framesSinceHit = frame - lastHit;

  // Quick punch scale that decays in 10 frames
  let punchScale = 1;
  let flashOpacity = 0;

  if (framesSinceHit >= 0 && framesSinceHit < 14) {
    const p = spring({
      frame: framesSinceHit,
      fps,
      config: { damping: 10, stiffness: 220, mass: 0.5 },
    });
    punchScale = interpolate(p, [0, 1], [1.045, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    flashOpacity = interpolate(framesSinceHit, [0, 6], [0.18, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  return (
    <AbsoluteFill style={{ transform: `scale(${punchScale})`, transformOrigin: "center center" }}>
      {children}
      {flashOpacity > 0 && (
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            backgroundColor: "#FFFFFF",
            opacity: flashOpacity,
            mixBlendMode: "overlay",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
