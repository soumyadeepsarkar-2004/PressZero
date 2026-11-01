import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile, Audio } from "remotion";
import { BgMesh } from "../components/BgMesh";
import { Grade } from "../components/Grade";
import { Grain } from "../components/Grain";
import { Vignette } from "../components/Vignette";
import { WordReveal } from "../components/WordReveal";
import { Entrance } from "../components/Entrance";
import { CameraPunch } from "../components/CameraPunch";
import { HudOverlay } from "../components/HudOverlay";
import { theme } from "../theme";

export const BleachScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Fast exit
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames - 2],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Scanner sweep wipe from 0% to 100%
  const wipeProgress = interpolate(frame, [18, 72], [0, 100], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Stamp badge pop after wipe finishes
  const stampPop = spring({
    frame: frame - 74,
    fps,
    config: { damping: 9, stiffness: 220, mass: 0.6 },
  });

  return (
    <CameraPunch hitFrames={[18, 74]}>
      <AbsoluteFill style={{ opacity: exitOpacity }}>
        {/* Layer 1: Background Mesh */}
        <BgMesh accentColor="#3B82F6" />

        {/* High-Tech HUD Layer */}
        <HudOverlay label="ADAPTIVE BLEACH // HISTOGRAM EQUALIZED" />

        {/* Layer 2 & 3: Content */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "150px 48px 130px 48px",
            fontFamily: theme.fonts.display,
          }}
        >
          {/* Top Header */}
          <div style={{ textAlign: "center" }}>
            <Entrance delay={2} direction="down" distance={20}>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#60A5FA",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontFamily: theme.fonts.mono,
                }}
              >
                Adaptive Binarization
              </span>
            </Entrance>

            <div style={{ marginTop: 12 }}>
              <WordReveal
                text="AI Signature Bleach Filter"
                delay={6}
                perWordFrames={3}
                highlightWord="Bleach"
                highlightColor="#60A5FA"
                style={{
                  fontSize: 70,
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  color: theme.colors.text,
                }}
              />
            </div>

            <Entrance delay={18} direction="up" distance={16}>
              <p style={{ marginTop: 10, fontSize: 26, color: theme.colors.textDim }}>
                Instantly converts shadowy paper snapshots into pure 255/255 white parchment.
              </p>
            </Entrance>
          </div>

          {/* Center Signature Scanner Comparison Box */}
          <Entrance delay={14} direction="up" distance={30} scaleFrom={0.93} preset="bouncy">
            <div
              style={{
                position: "relative",
                width: 940,
                height: 540,
                borderRadius: 28,
                overflow: "hidden",
                border: "2px solid rgba(255, 255, 255, 0.22)",
                boxShadow: "0 40px 100px rgba(0, 0, 0, 0.85)",
              }}
            >
              {/* Raw Original (Bottom Layer: shadowy/yellow paper) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  filter: "sepia(0.35) contrast(1.1) brightness(0.9)",
                }}
              >
                <Img
                  src={staticFile("assets/signature_sample.jpg")}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                {/* "Before" label */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 28,
                    left: 32,
                    padding: "8px 18px",
                    borderRadius: 8,
                    backgroundColor: "rgba(0,0,0,0.85)",
                    color: "#F87171",
                    fontSize: 16,
                    fontWeight: 800,
                    fontFamily: theme.fonts.mono,
                    border: "1px solid rgba(248,113,113,0.35)",
                  }}
                >
                  ORIGINAL: SHADOW & NOISE
                </div>
              </div>

              {/* Bleached Clean Layer (Clipped to the wipe progress) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  clipPath: `polygon(0 0, ${wipeProgress}% 0, ${wipeProgress}% 100%, 0 100%)`,
                  backgroundColor: "#FFFFFF",
                  filter: "contrast(2.2) brightness(1.15) grayscale(1)",
                }}
              >
                <Img
                  src={staticFile("assets/signature_sample.jpg")}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    mixBlendMode: "multiply",
                  }}
                />
                {/* "Bleached" label */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 28,
                    left: 32,
                    padding: "8px 18px",
                    borderRadius: 8,
                    backgroundColor: "rgba(0, 0, 0, 0.9)",
                    color: theme.colors.accentEmerald,
                    fontSize: 16,
                    fontWeight: 800,
                    fontFamily: theme.fonts.mono,
                    border: `1.5px solid ${theme.colors.accentEmerald}`,
                  }}
                >
                  BLEACHED: 255/255 PURE WHITE
                </div>
              </div>

              {/* High-intensity Laser scanning line with blue bloom */}
              {wipeProgress > 0 && wipeProgress < 100 && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: `${wipeProgress}%`,
                    width: 5,
                    backgroundColor: "#93C5FD",
                    boxShadow: "0 0 35px 8px #3B82F6, 0 0 70px 14px #60A5FA",
                  }}
                />
              )}

              {/* Stamp pop when finished */}
              {frame >= 74 && (
                <div
                  style={{
                    position: "absolute",
                    top: 32,
                    right: 32,
                    opacity: stampPop,
                    transform: `scale(${interpolate(stampPop, [0, 1], [1.5, 1])}) rotate(-5deg)`,
                    padding: "12px 28px",
                    borderRadius: 14,
                    backgroundColor: "rgba(16, 185, 129, 0.95)",
                    color: "#000000",
                    fontWeight: 900,
                    fontSize: 20,
                    letterSpacing: "0.08em",
                    fontFamily: theme.fonts.mono,
                    boxShadow: "0 16px 40px rgba(16, 185, 129, 0.6)",
                  }}
                >
                  ✓ 100% PORTAL COMPLIANT
                </div>
              )}
            </div>
          </Entrance>

          {/* Feature Tags Row */}
          <Entrance delay={28} direction="up" distance={16} preset="snappy">
            <div style={{ display: "flex", gap: 18 }}>
              {["Otsu Thresholding", "Zero Edge Blur", "Under 15 KB Limit"].map((item, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    padding: "10px 22px",
                    borderRadius: 10,
                    backgroundColor: "rgba(255, 255, 255, 0.06)",
                    border: "1.5px solid rgba(255, 255, 255, 0.16)",
                    color: theme.colors.text,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  }}
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          </Entrance>
        </AbsoluteFill>

        {/* SFX Audio */}
        <Audio src={staticFile("sfx/whoosh.wav")} startFrom={0} volume={0.65} />
        {frame >= 20 && frame <= 70 && frame % 10 === 0 && (
          <Audio src={staticFile("sfx/tick.wav")} volume={0.45} />
        )}
        {frame >= 74 && <Audio src={staticFile("sfx/bass.wav")} volume={0.85} />}

        {/* Layer 4: Color Grade */}
        <Grade />

        {/* Layer 5: Grain + Vignette */}
        <Grain />
        <Vignette />
      </AbsoluteFill>
    </CameraPunch>
  );
};
