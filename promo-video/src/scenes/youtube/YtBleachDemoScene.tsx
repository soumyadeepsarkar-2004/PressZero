import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { theme } from "../../theme";
import { BgMesh } from "../../components/BgMesh";
import { Grain } from "../../components/Grain";
import { Grade } from "../../components/Grade";
import { Vignette } from "../../components/Vignette";
import { CameraPunch } from "../../components/CameraPunch";
import { HudOverlay } from "../../components/HudOverlay";

export const YtBleachDemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const introSpring = spring({ frame, fps, config: theme.spring.smooth });

  // Laser sweep progression
  const sweep = interpolate(frame, [60, 220], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: theme.ease.inOut,
  });

  // Stamp slam spring
  const stampSpring = spring({
    frame: frame - 260,
    fps,
    config: { damping: 9, stiffness: 220, mass: 0.8 },
  });

  return (
    <CameraPunch hitFrames={[60, 260]}>
      <AbsoluteFill style={{ backgroundColor: theme.colors.bg, overflow: "hidden", fontFamily: theme.fonts.display }}>
        <BgMesh accentColor="#10B981" />

        {frame === 60 && <Audio src={staticFile("sfx/whoosh.wav")} volume={0.8} />}
        {frame === 260 && <Audio src={staticFile("sfx/bass.wav")} volume={1.0} />}

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
            background: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.4)",
            borderRadius: 9999,
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10B981" }} />
          <span style={{ fontSize: 16, fontWeight: 700, color: "#6EE7B7", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            INSTANT SIGNATURE BLEACH FILTER
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
            gridTemplateColumns: "1.2fr 1fr",
            gap: 48,
            alignItems: "center",
          }}
        >
          {/* Visual: Simulated Signature Canvas with Sweep */}
          <div
            style={{
              position: "relative",
              height: 480,
              borderRadius: 24,
              overflow: "hidden",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0 25px 70px rgba(0,0,0,0.6)",
            }}
          >
            {/* Base Muddy Background (Before) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(ellipse at 30% 40%, #e2d9b8 0%, #b8ab82 70%, #7d7252 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ position: "absolute", top: 20, left: 24, fontSize: 14, fontWeight: 700, color: "#544a30", fontFamily: theme.fonts.mono }}>
                BEFORE: Phone Photo with Harsh Desk Shadows
              </div>
              <svg width="460" height="180" viewBox="0 0 460 180" fill="none">
                <path
                  d="M 40 120 Q 90 20 150 110 T 260 90 T 360 140 T 420 50"
                  stroke="#1c2538"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M 80 140 L 400 135" stroke="#1c2538" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </div>

            {/* Bleached 255-White Overlay (Clipped by Sweep) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                width: `${sweep}%`,
                overflow: "hidden",
                background: "#FFFFFF",
                borderRight: sweep < 100 ? "4px solid #10B981" : "none",
                boxShadow: sweep < 100 ? "5px 0 25px rgba(16, 185, 129, 0.8)" : "none",
              }}
            >
              <div
                style={{
                  width: 730,
                  height: "100%",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ position: "absolute", top: 20, left: 24, fontSize: 14, fontWeight: 700, color: "#10B981", fontFamily: theme.fonts.mono }}>
                  AFTER: 100% Pure RGB(255, 255, 255) Parchment
                </div>
                <svg width="460" height="180" viewBox="0 0 460 180" fill="none">
                  <path
                    d="M 40 120 Q 90 20 150 110 T 260 90 T 360 140 T 420 50"
                    stroke="#000000"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M 80 140 L 400 135" stroke="#000000" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Slam Stamp */}
            {frame >= 260 && (
              <div
                style={{
                  position: "absolute",
                  bottom: 30,
                  right: 30,
                  transform: `rotate(-8deg) scale(${stampSpring})`,
                  padding: "10px 24px",
                  border: "4px solid #10B981",
                  borderRadius: 12,
                  background: "rgba(16, 185, 129, 0.95)",
                  color: "#08080A",
                  fontSize: 22,
                  fontWeight: 900,
                  letterSpacing: "0.1em",
                  boxShadow: "0 10px 30px rgba(16, 185, 129, 0.5)",
                }}
              >
                100% PORTAL COMPLIANT
              </div>
            )}
          </div>

          {/* Right Text Description */}
          <div>
            <h2 style={{ fontSize: 48, fontWeight: 900, color: theme.colors.text, lineHeight: 1.2, marginBottom: 24 }}>
              Zero Shadows.
              <br />
              <span style={{ color: "#10B981" }}>Pure White Paper.</span>
            </h2>

            <p style={{ fontSize: 20, color: theme.colors.textDim, lineHeight: 1.6, marginBottom: 32 }}>
              Government portals reject 40% of signatures due to paper shadows, wrinkles, or yellow lighting.
              PressZero's Otsu thresholding analyzes local luminance variance and bleaches the background to absolute 255-white without thinning pen strokes.
            </p>

            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ padding: "14px 20px", background: "rgba(255,255,255,0.05)", borderRadius: 12, border: "1px solid #333" }}>
                <div style={{ fontSize: 13, color: theme.colors.textMuted }}>Thresholding</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: theme.colors.text }}>Adaptive Otsu</div>
              </div>
              <div style={{ padding: "14px 20px", background: "rgba(255,255,255,0.05)", borderRadius: 12, border: "1px solid #333" }}>
                <div style={{ fontSize: 13, color: theme.colors.textMuted }}>Processing Latency</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#10B981" }}>&lt; 35ms (Client CPU)</div>
              </div>
            </div>
          </div>
        </div>

        <HudOverlay label="PRESSZERO YOUTUBE MASTER // CH.04 SIGNATURE BLEACHING" />
        <Grade />
        <Vignette />
        <Grain />
      </AbsoluteFill>
    </CameraPunch>
  );
};
