import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { theme } from "../../theme";
import { BgMesh } from "../../components/BgMesh";
import { Grain } from "../../components/Grain";
import { Grade } from "../../components/Grade";
import { Vignette } from "../../components/Vignette";
import { CameraPunch } from "../../components/CameraPunch";
import { HudOverlay } from "../../components/HudOverlay";

export const YtPrivacyProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const introSpring = spring({ frame, fps, config: theme.spring.smooth });

  // Contrast reveal spring
  const rightSpring = spring({ frame: frame - 60, fps, config: theme.spring.snappy });

  return (
    <CameraPunch hitFrames={[40, 120]}>
      <AbsoluteFill style={{ backgroundColor: theme.colors.bg, overflow: "hidden", fontFamily: theme.fonts.display }}>
        <BgMesh accentColor="#F59E0B" />

        {frame === 0 && <Audio src={staticFile("sfx/whoosh.wav")} volume={0.8} />}
        {frame === 60 && <Audio src={staticFile("sfx/bass.wav")} volume={0.9} />}

        {/* Section Pill */}
        <div
          style={{
            position: "absolute",
            top: 55,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 24px",
            background: "rgba(245, 158, 11, 0.12)",
            border: "1px solid rgba(245, 158, 11, 0.4)",
            borderRadius: 9999,
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#F59E0B" }} />
          <span style={{ fontSize: 16, fontWeight: 700, color: "#FCD34D", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            THE PRIVACY TRAP OF ONLINE COMPRESSORS
          </span>
        </div>

        {/* Side-by-Side Comparison Container */}
        <div
          style={{
            position: "absolute",
            top: "52%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${introSpring})`,
            width: 1350,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
          }}
        >
          {/* Box 1: Ordinary Cloud Compressors (Flawed) */}
          <div
            style={{
              background: "rgba(24, 18, 20, 0.85)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: 24,
              padding: 44,
              boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  background: "rgba(239, 68, 68, 0.2)",
                  color: "#EF4444",
                  fontWeight: 800,
                  fontSize: 14,
                  letterSpacing: "0.1em",
                }}
              >
                THE OLD WAY
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: theme.colors.text }}>Generic Cloud Tools</h3>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 20 }}>
              <li style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span style={{ color: "#EF4444", fontSize: 22, fontWeight: 900 }}>✕</span>
                <div>
                  <strong style={{ color: "#FCA5A5", fontSize: 18, display: "block" }}>Uploads Private IDs to Cloud</strong>
                  <span style={{ color: theme.colors.textDim, fontSize: 15 }}>
                    Your sensitive Aadhaar, PAN card, or passport is transmitted and saved on foreign servers.
                  </span>
                </div>
              </li>

              <li style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span style={{ color: "#EF4444", fontSize: 22, fontWeight: 900 }}>✕</span>
                <div>
                  <strong style={{ color: "#FCA5A5", fontSize: 18, display: "block" }}>Vague Quality Sliders (Guesswork)</strong>
                  <span style={{ color: theme.colors.textDim, fontSize: 15 }}>
                    Slide to 80% → 72 KB (Rejected). Slide to 65% → 35 KB (Muddy pixelated mess). No exact KB guarantee.
                  </span>
                </div>
              </li>

              <li style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span style={{ color: "#EF4444", fontSize: 22, fontWeight: 900 }}>✕</span>
                <div>
                  <strong style={{ color: "#FCA5A5", fontSize: 18, display: "block" }}>Dirty Backgrounds Remain Muddy</strong>
                  <span style={{ color: theme.colors.textDim, fontSize: 15 }}>
                    Phone shadows and yellow paper cause automated portal rejection.
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Box 2: The PressZero Standard (Superior) */}
          <div
            style={{
              background: "rgba(16, 28, 24, 0.85)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              borderRadius: 24,
              padding: 44,
              boxShadow: "0 25px 60px rgba(16, 185, 129, 0.15)",
              opacity: rightSpring,
              transform: `scale(${interpolate(rightSpring, [0, 1], [0.95, 1])})`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  background: "rgba(16, 185, 129, 0.2)",
                  color: "#10B981",
                  fontWeight: 800,
                  fontSize: 14,
                  letterSpacing: "0.1em",
                }}
              >
                THE PRESSZERO STANDARD
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: theme.colors.text }}>100% Client-Side Engine</h3>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 20 }}>
              <li style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span style={{ color: "#10B981", fontSize: 22, fontWeight: 900 }}>✓</span>
                <div>
                  <strong style={{ color: "#6EE7B7", fontSize: 18, display: "block" }}>Zero-Knowledge (0 Bytes Egress)</strong>
                  <span style={{ color: theme.colors.textDim, fontSize: 15 }}>
                    All compression runs locally on your browser CPU via Web Workers. Not even 1 byte leaves your device.
                  </span>
                </div>
              </li>

              <li style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span style={{ color: "#10B981", fontSize: 22, fontWeight: 900 }}>✓</span>
                <div>
                  <strong style={{ color: "#6EE7B7", fontSize: 18, display: "block" }}>Exact Target-KB Bisection</strong>
                  <span style={{ color: theme.colors.textDim, fontSize: 15 }}>
                    Type "50 KB". The binary search engine hits 49.8 KB on the dot in under 80 milliseconds.
                  </span>
                </div>
              </li>

              <li style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span style={{ color: "#10B981", fontSize: 22, fontWeight: 900 }}>✓</span>
                <div>
                  <strong style={{ color: "#6EE7B7", fontSize: 18, display: "block" }}>Instant AI Signature Bleach</strong>
                  <span style={{ color: theme.colors.textDim, fontSize: 15 }}>
                    Otsu dynamic thresholding wipes shadows to 100% pure 255-white with zero stroke distortion.
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <HudOverlay label="PRESSZERO YOUTUBE MASTER // CH.02 PRIVACY PARADIGM" />
        <Grade />
        <Vignette />
        <Grain />
      </AbsoluteFill>
    </CameraPunch>
  );
};
