import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { theme } from "../../theme";
import { BgMesh } from "../../components/BgMesh";
import { Grain } from "../../components/Grain";
import { Grade } from "../../components/Grade";
import { Vignette } from "../../components/Vignette";
import { CameraPunch } from "../../components/CameraPunch";
import { HudOverlay } from "../../components/HudOverlay";

export const YtBiometricCropScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const introSpring = spring({ frame, fps, config: theme.spring.smooth });

  // Reticle snap at frame 60
  const reticleSnap = spring({ frame: frame - 60, fps, config: theme.spring.snappy });

  return (
    <CameraPunch hitFrames={[60, 180]}>
      <AbsoluteFill style={{ backgroundColor: theme.colors.bg, overflow: "hidden", fontFamily: theme.fonts.display }}>
        <BgMesh accentColor="#3B82F6" />

        {frame === 60 && <Audio src={staticFile("sfx/tick.wav")} volume={0.8} />}
        {frame === 180 && <Audio src={staticFile("sfx/pop.wav")} volume={0.7} />}

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
            background: "rgba(59, 130, 246, 0.12)",
            border: "1px solid rgba(59, 130, 246, 0.4)",
            borderRadius: 9999,
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#3B82F6" }} />
          <span style={{ fontSize: 16, fontWeight: 700, color: "#93C5FD", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            BIOMETRIC PASSPORT & VISA CROPPER
          </span>
        </div>

        {/* Main Stage */}
        <div
          style={{
            position: "absolute",
            top: "52%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${introSpring})`,
            width: 1350,
            display: "grid",
            gridTemplateColumns: "500px 1fr",
            gap: 56,
            alignItems: "center",
          }}
        >
          {/* Left: Passport Photo with Reticle Overlay */}
          <div
            style={{
              position: "relative",
              width: 480,
              height: 520,
              borderRadius: 24,
              overflow: "hidden",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              background: "#18181D",
              boxShadow: "0 25px 70px rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Portrait Silhouette */}
            <svg width="260" height="340" viewBox="0 0 260 340" fill="none">
              <circle cx="130" cy="110" r="65" fill="#2A2A35" stroke="#444" strokeWidth="2" />
              <path d="M 40 310 C 50 210, 210 210, 220 310 Z" fill="#2A2A35" stroke="#444" strokeWidth="2" />
            </svg>

            {/* Reticle Lines (Spring into place) */}
            <div
              style={{
                position: "absolute",
                inset: 30,
                border: "2px dashed #10B981",
                borderRadius: 12,
                opacity: reticleSnap,
                transform: `scale(${interpolate(reticleSnap, [0, 1], [1.1, 1])})`,
                pointerEvents: "none",
              }}
            >
              {/* Eye guideline */}
              <div
                style={{
                  position: "absolute",
                  top: "35%",
                  left: 0,
                  right: 0,
                  height: 1,
                  background: "#10B981",
                  boxShadow: "0 0 8px #10B981",
                }}
              >
                <span style={{ position: "absolute", right: 8, top: -18, fontSize: 11, fontFamily: theme.fonts.mono, color: "#10B981" }}>
                  EYE LEVEL 60%
                </span>
              </div>

              {/* Chin guideline */}
              <div
                style={{
                  position: "absolute",
                  top: "65%",
                  left: 0,
                  right: 0,
                  height: 1,
                  background: "#10B981",
                  boxShadow: "0 0 8px #10B981",
                }}
              >
                <span style={{ position: "absolute", right: 8, top: 4, fontSize: 11, fontFamily: theme.fonts.mono, color: "#10B981" }}>
                  CHIN LINE
                </span>
              </div>
            </div>

            {/* Reticle Lock Badge */}
            {frame >= 60 && (
              <div
                style={{
                  position: "absolute",
                  bottom: 24,
                  padding: "6px 16px",
                  background: "rgba(16, 185, 129, 0.2)",
                  border: "1px solid #10B981",
                  borderRadius: 9999,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#6EE7B7",
                }}
              >
                35 × 45 mm (300 DPI) LOCKED
              </div>
            )}
          </div>

          {/* Right: Presets Grid */}
          <div>
            <h2 style={{ fontSize: 48, fontWeight: 900, color: theme.colors.text, lineHeight: 1.2, marginBottom: 20 }}>
              Biometric Presets for
              <br />
              <span style={{ color: "#3B82F6" }}>Every Major Portal.</span>
            </h2>

            <p style={{ fontSize: 20, color: theme.colors.textDim, lineHeight: 1.6, marginBottom: 32 }}>
              Stop manual pixel cropping. PressZero features built-in aspect ratio and biometric reticle guides that match official consulate standards.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { name: "US Visa (DS-160)", dims: "2 × 2 inches (600×600 px)" },
                { name: "Schengen Visa", dims: "35 × 45 mm (White background)" },
                { name: "UPSC & SSC Exams", dims: "3.5 × 4.5 cm (≤ 50 KB)" },
                { name: "Passport Seva (India)", dims: "4.5 × 3.5 cm (≤ 100 KB)" },
              ].map((preset) => (
                <div
                  key={preset.name}
                  style={{
                    padding: "16px 20px",
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: 16,
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 700, color: theme.colors.text, marginBottom: 4 }}>
                    {preset.name}
                  </div>
                  <div style={{ fontSize: 13, color: "#93C5FD", fontFamily: theme.fonts.mono }}>
                    {preset.dims}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <HudOverlay label="PRESSZERO YOUTUBE MASTER // CH.05 BIOMETRIC CROPPING" />
        <Grade />
        <Vignette />
        <Grain />
      </AbsoluteFill>
    </CameraPunch>
  );
};
