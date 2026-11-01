import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile, Audio } from "remotion";
import { BgMesh } from "../components/BgMesh";
import { Grade } from "../components/Grade";
import { Grain } from "../components/Grain";
import { Vignette } from "../components/Vignette";
import { WordReveal } from "../components/WordReveal";
import { Entrance } from "../components/Entrance";
import { theme } from "../theme";

export const PassportCropScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Fast exit
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames - 2],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Crosshairs snap in
  const reticleProgress = spring({
    frame: frame - 22,
    fps,
    config: theme.spring.bouncy,
  });

  const reticleScale = interpolate(reticleProgress, [0, 1], [1.25, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: exitOpacity }}>
      {/* Layer 1: Background Mesh */}
      <BgMesh accentColor="#F59E0B" />

      {/* Layer 2 & 3: Content */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "160px 48px 140px 48px",
          fontFamily: theme.fonts.display,
        }}
      >
        {/* Top Header */}
        <div style={{ textAlign: "center" }}>
          <Entrance delay={4} direction="down" distance={20}>
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#FBBF24",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontFamily: theme.fonts.mono,
              }}
            >
              ICAO Biometric Standards
            </span>
          </Entrance>

          <div style={{ marginTop: 14 }}>
            <WordReveal
              text="Biometric Cropper & Aspect Guard"
              delay={8}
              perWordFrames={4}
              highlightWord="Biometric"
              highlightColor="#FBBF24"
              style={{
                fontSize: 66,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: theme.colors.text,
              }}
            />
          </div>

          <Entrance delay={22} direction="up" distance={16}>
            <p style={{ marginTop: 12, fontSize: 26, color: theme.colors.textDim }}>
              Exact 35×45mm, 350×350px & 600×600px aspect ratio enforcement.
            </p>
          </Entrance>
        </div>

        {/* Center Biometric Target Frame */}
        <Entrance delay={16} direction="up" distance={30} scaleFrom={0.92}>
          <div
            style={{
              position: "relative",
              width: 520,
              height: 640,
              borderRadius: 24,
              overflow: "hidden",
              border: "2.5px solid #FBBF24",
              boxShadow: "0 30px 90px rgba(0, 0, 0, 0.85)",
            }}
          >
            <Img
              src={staticFile("assets/passport_sample.jpg")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

            {/* Biometric Head / Eye Overlay Reticle */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                border: "2px dashed rgba(251, 191, 36, 0.6)",
                margin: 28,
                borderRadius: 16,
                transform: `scale(${reticleScale})`,
                opacity: reticleProgress,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 20,
              }}
            >
              {/* Eye line */}
              <div
                style={{
                  position: "absolute",
                  top: "38%",
                  left: 0,
                  right: 0,
                  height: 1.5,
                  backgroundColor: "rgba(251, 191, 36, 0.85)",
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0 10px",
                }}
              >
                <span style={{ fontSize: 13, color: "#FBBF24", fontFamily: theme.fonts.mono, marginTop: -18, fontWeight: 700 }}>
                  EYE LEVEL 68%
                </span>
                <span style={{ fontSize: 13, color: "#FBBF24", fontFamily: theme.fonts.mono, marginTop: -18, fontWeight: 700 }}>
                  ICAO OK
                </span>
              </div>

              {/* Chin line */}
              <div
                style={{
                  position: "absolute",
                  top: "76%",
                  left: 0,
                  right: 0,
                  height: 1.5,
                  backgroundColor: "rgba(251, 191, 36, 0.85)",
                  padding: "0 10px",
                }}
              >
                <span style={{ fontSize: 13, color: "#FBBF24", fontFamily: theme.fonts.mono, marginTop: -18, fontWeight: 700 }}>
                  CHIN LINE
                </span>
              </div>

              {/* Top dimension tag */}
              <div
                style={{
                  alignSelf: "flex-start",
                  padding: "6px 14px",
                  borderRadius: 6,
                  backgroundColor: "rgba(0, 0, 0, 0.85)",
                  color: "#FBBF24",
                  fontSize: 14,
                  fontFamily: theme.fonts.mono,
                  fontWeight: 800,
                  border: "1px solid rgba(251, 191, 36, 0.3)",
                }}
              >
                35 mm × 45 mm
              </div>

              {/* Bottom compliance tag */}
              <div
                style={{
                  alignSelf: "flex-end",
                  padding: "6px 14px",
                  borderRadius: 6,
                  backgroundColor: "rgba(16, 185, 129, 0.95)",
                  color: "#000000",
                  fontSize: 14,
                  fontFamily: theme.fonts.mono,
                  fontWeight: 800,
                }}
              >
                PASSED 20–50 KB
              </div>
            </div>
          </div>
        </Entrance>

        {/* Portal Badges */}
        <Entrance delay={32} direction="up" distance={16}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            {["UPSC Civil Services", "NTA NEET / JEE", "US Visa 600×600", "Passport Seva"].map(
              (portal, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                    padding: "10px 20px",
                    borderRadius: 10,
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.14)",
                    color: theme.colors.text,
                    fontFamily: theme.fonts.mono,
                  }}
                >
                  {portal}
                </span>
              )
            )}
          </div>
        </Entrance>
      </AbsoluteFill>

      {/* SFX Audio */}
      <Audio src={staticFile("sfx/whoosh.wav")} startFrom={0} volume={0.6} />
      {frame >= 24 && <Audio src={staticFile("sfx/tick.wav")} volume={0.6} />}
      {frame >= 35 && <Audio src={staticFile("sfx/pop.wav")} volume={0.7} />}

      {/* Layer 4: Color Grade */}
      <Grade />

      {/* Layer 5: Grain + Vignette */}
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
