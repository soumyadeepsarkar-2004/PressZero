import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Audio, staticFile } from "remotion";
import { BgMesh } from "../components/BgMesh";
import { Grade } from "../components/Grade";
import { Grain } from "../components/Grain";
import { Vignette } from "../components/Vignette";
import { ApertureLogo } from "../components/ApertureLogo";
import { WordReveal } from "../components/WordReveal";
import { Entrance } from "../components/Entrance";
import { theme } from "../theme";

export const ZeroKnowledgeCtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Floating breathing effect on the final card
  const breathe = 1 + Math.sin(frame / 20) * 0.015;

  // Final glow pulse on the CTA link
  const glowPulse = 0.5 + Math.sin(frame / 12) * 0.35;

  return (
    <AbsoluteFill>
      {/* Layer 1: Background Mesh */}
      <BgMesh accentColor={theme.colors.accentEmerald} />

      {/* Layer 2 & 3: Content */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "160px 48px 140px 48px",
          textAlign: "center",
          fontFamily: theme.fonts.display,
        }}
      >
        {/* Zero Egress Big Telemetry Badge */}
        <Entrance delay={4} direction="down" distance={24}>
          <div
            style={{
              padding: "18px 42px",
              borderRadius: 24,
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              border: "2px solid rgba(16, 185, 129, 0.5)",
              boxShadow: "0 0 50px rgba(16, 185, 129, 0.25)",
              display: "inline-flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                backgroundColor: theme.colors.accentEmerald,
                boxShadow: "0 0 20px #10B981",
              }}
            />
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 900,
                  color: theme.colors.text,
                  fontFamily: theme.fonts.mono,
                  letterSpacing: "0.05em",
                }}
              >
                0 BYTES EGRESS
              </div>
              <div style={{ fontSize: 16, color: theme.colors.accentEmerald, fontWeight: 700, letterSpacing: "0.04em" }}>
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
            gap: 32,
            maxWidth: 960,
          }}
        >
          <div style={{ transform: `scale(${breathe})` }}>
            <ApertureLogo size={190} delay={10} showWordmark={true} />
          </div>

          <div style={{ marginTop: 16 }}>
            <WordReveal
              text="Compress directly on your device."
              delay={22}
              perWordFrames={4}
              highlightWord="directly"
              highlightColor={theme.colors.accentEmerald}
              style={{
                fontSize: 68,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: theme.colors.text,
                lineHeight: 1.08,
              }}
            />
          </div>

          <Entrance delay={38} direction="up" distance={18}>
            <p
              style={{
                fontSize: 28,
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
            gap: 24,
          }}
        >
          <Entrance delay={32} direction="up" distance={24} scaleFrom={0.92}>
            <div
              style={{
                padding: "22px 56px",
                borderRadius: 999,
                backgroundColor: "#FFFFFF",
                color: "#000000",
                fontWeight: 900,
                fontSize: 30,
                letterSpacing: "-0.02em",
                boxShadow: `0 0 50px rgba(255, 255, 255, ${glowPulse}), 0 16px 36px rgba(0, 0, 0, 0.7)`,
                display: "inline-flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <span>Try PressZero Now</span>
              <span style={{ fontSize: 28 }}>→</span>
            </div>
          </Entrance>

          {/* Prominent High-Contrast Domain Pill */}
          <Entrance delay={40} direction="up" distance={16}>
            <div
              style={{
                padding: "12px 36px",
                borderRadius: 999,
                backgroundColor: "rgba(16, 185, 129, 0.22)",
                border: "2px solid #10B981",
                boxShadow: "0 0 35px rgba(16, 185, 129, 0.4)",
                fontSize: 26,
                fontWeight: 800,
                color: "#FFFFFF",
                fontFamily: theme.fonts.mono,
                letterSpacing: "0.04em",
              }}
            >
              <span style={{ color: theme.colors.accentEmerald }}>https://</span>presszero.antideploy.app
            </div>
          </Entrance>
        </div>
      </AbsoluteFill>

      {/* SFX Audio */}
      <Audio src={staticFile("sfx/bass.wav")} startFrom={0} volume={0.8} />
      {frame >= 22 && <Audio src={staticFile("sfx/whoosh.wav")} volume={0.6} />}
      {frame >= 46 && <Audio src={staticFile("sfx/pop.wav")} volume={0.9} />}

      {/* Layer 4: Color Grade */}
      <Grade />

      {/* Layer 5: Grain + Vignette */}
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
