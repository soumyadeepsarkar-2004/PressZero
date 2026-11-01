import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Audio, staticFile } from "remotion";
import { BgMesh } from "../components/BgMesh";
import { Grade } from "../components/Grade";
import { Grain } from "../components/Grain";
import { Vignette } from "../components/Vignette";
import { ApertureLogo } from "../components/ApertureLogo";
import { WordReveal } from "../components/WordReveal";
import { Entrance } from "../components/Entrance";
import { theme } from "../theme";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Fast exit transition (Rule 4: exits faster than entrances ~10 frames)
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
    <AbsoluteFill style={{ opacity: exitOpacity, transform: `scale(${exitScale})` }}>
      {/* Layer 1: Background Mesh */}
      <BgMesh accentColor={theme.colors.accentEmerald} />

      {/* Layer 2 & 3: Content and Graphics */}
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
        {/* Floating Category Badge */}
        <Entrance delay={8} direction="down" distance={24}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 28px",
              borderRadius: 999,
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.16)",
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
                fontWeight: 700,
                color: theme.colors.text,
                letterSpacing: "0.06em",
                fontFamily: theme.fonts.mono,
              }}
            >
              ZERO-KNOWLEDGE IMAGE REDUCER
            </span>
          </div>
        </Entrance>

        {/* Center: Animated Aperture Logo & Massive Punch Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 36,
            maxWidth: 960,
          }}
        >
          <ApertureLogo size={210} delay={6} showWordmark={true} />

          <div style={{ marginTop: 20 }}>
            <WordReveal
              text="The exact target-KB image reducer."
              delay={24}
              perWordFrames={4}
              highlightWord="exact"
              highlightColor={theme.colors.accentEmerald}
              style={{
                fontSize: 78,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: theme.colors.text,
                lineHeight: 1.06,
              }}
            />
          </div>

          <Entrance delay={46} direction="up" distance={24}>
            <p
              style={{
                fontSize: 30,
                fontWeight: 400,
                color: theme.colors.textDim,
                maxWidth: 820,
                lineHeight: 1.4,
              }}
            >
              Compress photos and signatures to exact kilobyte limits directly in your browser.
            </p>
          </Entrance>
        </div>

        {/* Bottom Feature Badges */}
        <Entrance delay={58} direction="up" distance={20}>
          <div
            style={{
              display: "flex",
              gap: 20,
              justifyContent: "center",
            }}
          >
            {["0 Bytes Egress", "100% In-Memory", "Offline Ready"].map((tag, i) => (
              <span
                key={i}
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  padding: "10px 22px",
                  borderRadius: 10,
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: theme.colors.text,
                  fontFamily: theme.fonts.mono,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </Entrance>
      </AbsoluteFill>

      {/* SFX Audio */}
      <Audio src={staticFile("sfx/bass.wav")} startFrom={0} volume={0.8} />
      {frame >= 24 && <Audio src={staticFile("sfx/pop.wav")} volume={0.6} />}
      {frame >= 74 && <Audio src={staticFile("sfx/whoosh.wav")} volume={0.7} />}

      {/* Layer 4: Color Grade */}
      <Grade />

      {/* Layer 5: Grain + Vignette */}
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
