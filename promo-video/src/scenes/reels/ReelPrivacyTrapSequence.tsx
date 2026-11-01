import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Audio, staticFile } from "remotion";
import { BgMesh } from "../../components/BgMesh";
import { HudOverlay } from "../../components/HudOverlay";
import { CameraPunch } from "../../components/CameraPunch";
import { theme } from "../../theme";

export const ReelPrivacyTrapSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Entrance spring
  const titlePop = spring({
    frame: frame - 10,
    fps,
    config: { damping: 10, stiffness: 180 },
  });

  // Pulse animation for warning
  const alertPulse = Math.sin(frame * 0.15) * 0.2 + 0.8;

  // Network bytes counter animation
  const bytesSent = Math.floor(interpolate(frame, [45, 180], [0, 4820], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const pressZeroBytes = 0;

  // Comparison split slider
  const splitProgress = interpolate(frame, [160, 260], [0, 100], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <CameraPunch hitFrames={[10, 160, 320]}>
      <AbsoluteFill style={{ backgroundColor: "#06060A", fontFamily: theme.fonts.display }}>
        <Audio src={staticFile("sfx/track.wav")} volume={0.25} loop />
        <BgMesh accentColor="#EF4444" />
        <HudOverlay label="THREAT DETECTED // PRIVACY EGRESS AUDIT" />

        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "160px 48px 140px 48px",
          }}
        >
          {/* Top Hook Badge */}
          <div style={{ textAlign: "center", transform: `scale(${titlePop})` }}>
            <div
              style={{
                display: "inline-block",
                padding: "8px 20px",
                borderRadius: "30px",
                background: "rgba(239, 68, 68, 0.18)",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                color: "#EF4444",
                fontSize: "26px",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                opacity: alertPulse,
                marginBottom: "20px",
              }}
            >
              ⚠ PRIVACY WARNING
            </div>
            <h1
              style={{
                fontSize: "56px",
                lineHeight: 1.15,
                fontWeight: 800,
                color: "#FFFFFF",
                margin: 0,
                textShadow: "0 10px 40px rgba(0,0,0,0.8)",
              }}
            >
              Stop uploading your <span style={{ color: "#EF4444" }}>Aadhaar & Passport</span> to random compressors.
            </h1>
          </div>

          {/* Central Side-by-Side Comparison Box */}
          <div
            style={{
              width: "100%",
              maxWidth: "880px",
              background: "rgba(18, 18, 24, 0.85)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "28px",
              padding: "40px",
              boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Cloud Compressor Row (Red Warning) */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "24px 30px",
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                borderRadius: "18px",
                marginBottom: "24px",
              }}
            >
              <div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: "#EF4444" }}>
                  ❌ Other Web Compressors
                </div>
                <div style={{ fontSize: "22px", color: "rgba(255,255,255,0.6)", marginTop: "6px" }}>
                  Uploads private files to unknown cloud servers
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "36px", fontWeight: 800, color: "#EF4444", fontFamily: theme.fonts.mono }}>
                  {bytesSent.toLocaleString()} KB
                </div>
                <div style={{ fontSize: "18px", color: "#EF4444", fontWeight: 600 }}>EGRESS EXPOSED</div>
              </div>
            </div>

            {/* PressZero Row (Green Zero-Knowledge) */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "28px 30px",
                background: "rgba(16, 185, 129, 0.12)",
                border: "2px solid rgba(16, 185, 129, 0.45)",
                borderRadius: "18px",
              }}
            >
              <div>
                <div style={{ fontSize: "32px", fontWeight: 800, color: "#10B981" }}>
                  ✓ PressZero Studio
                </div>
                <div style={{ fontSize: "22px", color: "rgba(255,255,255,0.7)", marginTop: "6px" }}>
                  100% In-Browser WebAssembly compute
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "40px", fontWeight: 800, color: "#10B981", fontFamily: theme.fonts.mono }}>
                  0 BYTES
                </div>
                <div style={{ fontSize: "18px", color: "#10B981", fontWeight: 600 }}>AIRGAP VERIFIED</div>
              </div>
            </div>
          </div>

          {/* Bottom Outro & Call to Action */}
          <div style={{ textAlign: "center", width: "100%" }}>
            <div style={{ fontSize: "26px", color: "rgba(255,255,255,0.7)", marginBottom: "16px" }}>
              Runs entirely inside local phone RAM. Test in Airplane Mode!
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
                letterSpacing: "0.5px",
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
