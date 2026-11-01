import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Audio, staticFile } from "remotion";
import { BgMesh } from "../components/BgMesh";
import { Grade } from "../components/Grade";
import { Grain } from "../components/Grain";
import { Vignette } from "../components/Vignette";
import { ApertureLogo } from "../components/ApertureLogo";
import { WordReveal } from "../components/WordReveal";
import { Entrance } from "../components/Entrance";
import { CameraPunch } from "../components/CameraPunch";
import { HudOverlay } from "../components/HudOverlay";
import { theme } from "../theme";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Fast exit transition
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames - 2],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const exitScale = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames - 2],
    [1, 0.94],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <CameraPunch hitFrames={[10, 36]}>
      <AbsoluteFill style={{ opacity: exitOpacity, transform: `scale(${exitScale})` }}>
        {/* Layer 1: Background Mesh */}
        <BgMesh accentColor={theme.colors.accentEmerald} />

        {/* High-Tech HUD Layer */}
        <HudOverlay label="PRESSZERO // ZERO-EGRESS ENGINE" />

        {/* Layer 2 & 3: Content and Graphics */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "150px 48px 130px 48px",
            textAlign: "center",
            fontFamily: theme.fonts.display,
          }}
        >
          {/* Floating Category Badge */}
          <Entrance delay={4} direction="down" distance={24} preset="bouncy">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 28px",
                borderRadius: 999,
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                border: "1.5px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 0 25px rgba(16, 185, 129, 0.2)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: theme.colors.accentEmerald,
                  boxShadow: `0 0 14px ${theme.colors.accentEmerald}`,
                }}
              />
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: theme.colors.text,
                  letterSpacing: "0.08em",
                  fontFamily: theme.fonts.mono,
                }}
              >
                100% IN-MEMORY · ZERO SERVER EGRESS
              </span>
            </div>
          </Entrance>

          {/* Center: Animated Aperture Logo & Punch Headline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 32,
              maxWidth: 980,
            }}
          >
            <ApertureLogo size={220} delay={6} showWordmark={true} />

            <div style={{ marginTop: 14 }}>
              <WordReveal
                text="The exact target-KB image reducer."
                delay={16}
                perWordFrames={3}
                highlightWord="exact"
                highlightColor={theme.colors.accentEmerald}
                style={{
                  fontSize: 82,
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  color: theme.colors.text,
                  lineHeight: 1.05,
                }}
              />
            </div>

            <Entrance delay={34} direction="up" distance={20}>
              <p
                style={{
                  fontSize: 30,
                  fontWeight: 500,
                  color: theme.colors.textDim,
                  maxWidth: 820,
                  lineHeight: 1.38,
                }}
              >
                Never guess compression sliders again. Hits exact kilobyte bounds in 24 milliseconds.
              </p>
            </Entrance>
          </div>

          {/* Bottom Fast-Action Feature Badges */}
          <Entrance delay={44} direction="up" distance={20} preset="snappy">
            <div
              style={{
                display: "flex",
                gap: 18,
                justifyContent: "center",
              }}
            >
              {[
                "Target 20KB / 50KB",
                "Otsu Signature Bleach",
                "Biometric Aspect Guard",
              ].map((tag, i) => (
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
                    fontFamily: theme.fonts.mono,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  }}
                >
                  ⚡ {tag}
                </span>
              ))}
            </div>
          </Entrance>
        </AbsoluteFill>

        {/* SFX Audio Sync */}
        <Audio src={staticFile("sfx/bass.wav")} startFrom={0} volume={0.85} />
        {frame >= 16 && <Audio src={staticFile("sfx/pop.wav")} volume={0.7} />}
        {frame >= 36 && <Audio src={staticFile("sfx/whoosh.wav")} volume={0.75} />}

        {/* Layer 4: Color Grade */}
        <Grade />

        {/* Layer 5: Grain + Vignette */}
        <Grain />
        <Vignette />
      </AbsoluteFill>
    </CameraPunch>
  );
};
