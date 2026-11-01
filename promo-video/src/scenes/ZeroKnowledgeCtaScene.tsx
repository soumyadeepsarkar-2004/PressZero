import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Audio, staticFile } from "remotion";
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

export const ZeroKnowledgeCtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Floating breathing effect on the final card
  const breathe = 1 + Math.sin(frame / 20) * 0.02;

  // Final glow pulse on the CTA link
  const glowPulse = 0.55 + Math.sin(frame / 10) * 0.4;

  return (
    <CameraPunch hitFrames={[12, 38]}>
      <AbsoluteFill>
        {/* Layer 1: Background Mesh */}
        <BgMesh accentColor={theme.colors.accentEmerald} />

        {/* High-Tech HUD Layer */}
        <HudOverlay label="PRIVACY VERIFIED // 0 BYTES EGRESS" />

        {/* Layer 2 & 3: Content */}
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
          {/* Zero Egress Big Telemetry Badge */}
          <Entrance delay={2} direction="down" distance={24} preset="bouncy">
            <div
              style={{
                padding: "20px 46px",
                borderRadius: 24,
                backgroundColor: "rgba(16, 185, 129, 0.18)",
                border: "2px solid rgba(16, 185, 129, 0.6)",
                boxShadow: "0 0 60px rgba(16, 185, 129, 0.35)",
                display: "inline-flex",
                alignItems: "center",
                gap: 20,
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  backgroundColor: theme.colors.accentEmerald,
                  boxShadow: "0 0 25px #10B981",
                }}
              />
              <div style={{ textAlign: "left" }}>
                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 900,
                    color: theme.colors.text,
                    fontFamily: theme.fonts.mono,
                    letterSpacing: "0.06em",
                  }}
                >
                  0 BYTES EGRESS
                </div>
                <div style={{ fontSize: 17, color: theme.colors.accentEmerald, fontWeight: 800, letterSpacing: "0.05em" }}>
                  100% PRIVATE CLIENT-SIDE COMPUTING
                </div>
              </div>
            </div>
          </Entrance>

          {/* Center: Aperture Logo + Big Headline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 30,
              maxWidth: 980,
            }}
          >
            <div style={{ transform: `scale(${breathe})` }}>
              <ApertureLogo size={200} delay={8} showWordmark={true} />
            </div>

            <div style={{ marginTop: 14 }}>
              <WordReveal
                text="Compress directly on your device."
                delay={18}
                perWordFrames={3}
                highlightWord="directly"
                highlightColor={theme.colors.accentEmerald}
                style={{
                  fontSize: 72,
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  color: theme.colors.text,
                  lineHeight: 1.06,
                }}
              />
            </div>

            <Entrance delay={30} direction="up" distance={18}>
              <p
                style={{
                  fontSize: 28,
                  fontWeight: 500,
                  color: theme.colors.textDim,
                  maxWidth: 820,
                  lineHeight: 1.4,
                }}
              >
                Free & open source. No sign up, no quotas, zero server uploads.
              </p>
            </Entrance>
          </div>

          {/* Bottom CTA Block: Try Now Button + High-Contrast URL Pill */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 22,
            }}
          >
            <Entrance delay={36} direction="up" distance={24} scaleFrom={0.9} preset="bouncy">
              <div
                style={{
                  padding: "24px 60px",
                  borderRadius: 999,
                  backgroundColor: "#FFFFFF",
                  color: "#000000",
                  fontWeight: 900,
                  fontSize: 32,
                  letterSpacing: "-0.02em",
                  boxShadow: `0 0 60px rgba(255, 255, 255, ${glowPulse}), 0 16px 40px rgba(0, 0, 0, 0.8)`,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 18,
                }}
              >
                <span>Try PressZero Now</span>
                <span style={{ fontSize: 32 }}>→</span>
              </div>
            </Entrance>

            {/* Prominent High-Contrast Domain Pill */}
            <Entrance delay={44} direction="up" distance={16} preset="snappy">
              <div
                style={{
                  padding: "14px 40px",
                  borderRadius: 999,
                  backgroundColor: "rgba(16, 185, 129, 0.25)",
                  border: "2.5px solid #10B981",
                  boxShadow: "0 0 40px rgba(16, 185, 129, 0.5)",
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#FFFFFF",
                  fontFamily: theme.fonts.mono,
                  letterSpacing: "0.05em",
                }}
              >
                <span style={{ color: theme.colors.accentEmerald }}>https://</span>presszero.antideploy.app
              </div>
            </Entrance>
          </div>
        </AbsoluteFill>

        {/* SFX Audio */}
        <Audio src={staticFile("sfx/bass.wav")} startFrom={0} volume={0.85} />
        {frame >= 18 && <Audio src={staticFile("sfx/whoosh.wav")} volume={0.7} />}
        {frame >= 36 && <Audio src={staticFile("sfx/pop.wav")} volume={0.95} />}

        {/* Layer 4: Color Grade */}
        <Grade />

        {/* Layer 5: Grain + Vignette */}
        <Grain />
        <Vignette />
      </AbsoluteFill>
    </CameraPunch>
  );
};
