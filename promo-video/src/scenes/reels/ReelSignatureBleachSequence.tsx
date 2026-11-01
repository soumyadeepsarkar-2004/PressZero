import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Audio, staticFile, Img } from "remotion";
import { BgMesh } from "../../components/BgMesh";
import { HudOverlay } from "../../components/HudOverlay";
import { CameraPunch } from "../../components/CameraPunch";
import { theme } from "../../theme";

export const ReelSignatureBleachSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Entrance spring
  const headerPop = spring({
    frame: frame - 10,
    fps,
    config: { damping: 10, stiffness: 180 },
  });

  // Scanner wipe from 0% to 100% across the signature box
  const scanProgress = interpolate(frame, [50, 200], [0, 100], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Target KB indicator
  const targetKb = Math.floor(interpolate(frame, [180, 260], [185, 18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));

  // Stamp badge pop after wipe finishes
  const passBadgePop = spring({
    frame: frame - 230,
    fps,
    config: { damping: 8, stiffness: 240, mass: 0.5 },
  });

  return (
    <CameraPunch hitFrames={[10, 50, 230]}>
      <AbsoluteFill style={{ backgroundColor: "#06060A", fontFamily: theme.fonts.display }}>
        <Audio src={staticFile("sfx/track.wav")} volume={0.25} loop />
        <BgMesh accentColor="#3B82F6" />
        <HudOverlay label="OTSU BINARIZATION // DYNAMIC THRESHOLD LOCK" />

        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "160px 48px 140px 48px",
          }}
        >
          {/* Top Hook Callout */}
          <div style={{ textAlign: "center", transform: `scale(${headerPop})` }}>
            <div
              style={{
                display: "inline-block",
                padding: "8px 24px",
                borderRadius: "30px",
                background: "rgba(59, 130, 246, 0.18)",
                border: "1px solid rgba(59, 130, 246, 0.4)",
                color: "#60A5FA",
                fontSize: "26px",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginBottom: "20px",
              }}
            >
              UPSC / SSC / NTA FORM FIX
            </div>
            <h1
              style={{
                fontSize: "54px",
                lineHeight: 1.15,
                fontWeight: 800,
                color: "#FFFFFF",
                margin: 0,
                textShadow: "0 10px 40px rgba(0,0,0,0.8)",
              }}
            >
              Portal rejected your signature? It wasn't file size. <span style={{ color: "#F59E0B" }}>It was paper shadow.</span>
            </h1>
          </div>

          {/* Central Interactive Signature Bleach Simulation Box */}
          <div
            style={{
              width: "100%",
              maxWidth: "880px",
              position: "relative",
              background: "#0F1117",
              border: "2px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "28px",
              padding: "36px",
              boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Signature Box Preview with Wiper */}
            <div
              style={{
                width: "100%",
                height: "280px",
                borderRadius: "18px",
                overflow: "hidden",
                position: "relative",
                background: "#E2E8F0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Dirty shadowy side (left / background) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "#C7CCD6",
                  backgroundImage: "radial-gradient(circle at 70% 30%, #A0AEC0 0%, #718096 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ color: "#2D3748", fontSize: "48px", fontWeight: 700, fontStyle: "italic", opacity: 0.65 }}>
                  Dirty Phone Camera Shadow
                </div>
              </div>

              {/* Pure 255-White Otsu Bleached side (clipped by scanProgress) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "#FFFFFF",
                  clipPath: `polygon(0 0, ${scanProgress}% 0, ${scanProgress}% 100%, 0 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ color: "#000000", fontSize: "52px", fontWeight: 800, fontStyle: "italic" }}>
                  Pure 255-White Carbon Ink
                </div>
              </div>

              {/* Wiper Line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: `${scanProgress}%`,
                  width: "4px",
                  background: "#3B82F6",
                  boxShadow: "0 0 16px #3B82F6",
                }}
              />
            </div>

            {/* Bottom Meta Stats inside box */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                marginTop: "24px",
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              <div style={{ color: "rgba(255,255,255,0.7)" }}>
                Target Limit: <span style={{ color: "#60A5FA" }}>10 - 20 KB (UPSC)</span>
              </div>
              <div style={{ color: targetKb <= 20 ? "#10B981" : "#F59E0B", fontFamily: theme.fonts.mono }}>
                Size: {targetKb} KB {targetKb <= 20 && "✓ COMPLIANT"}
              </div>
            </div>

            {/* Stamp Badge */}
            {passBadgePop > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  transform: `scale(${passBadgePop}) rotate(-12deg)`,
                  background: "#10B981",
                  color: "#000000",
                  padding: "12px 24px",
                  borderRadius: "14px",
                  fontSize: "24px",
                  fontWeight: 900,
                  boxShadow: "0 10px 30px rgba(16,185,129,0.5)",
                }}
              >
                100% PORTAL PASS
              </div>
            )}
          </div>

          {/* Bottom Outro */}
          <div style={{ textAlign: "center", width: "100%" }}>
            <div style={{ fontSize: "26px", color: "rgba(255,255,255,0.7)", marginBottom: "16px" }}>
              No Photoshop needed. Fix your signature in 3 seconds:
            </div>
            <div
              style={{
                display: "inline-block",
                padding: "20px 48px",
                borderRadius: "20px",
                background: "#FFFFFF",
                color: "#000000",
                fontSize: "30px",
                fontWeight: 800,
                boxShadow: "0 15px 40px rgba(255,255,255,0.25)",
              }}
            >
              https://presszero.antideploy.app
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </CameraPunch>
  );
};
