import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { theme } from "../../theme";
import { BgMesh } from "../../components/BgMesh";
import { Grain } from "../../components/Grain";
import { Grade } from "../../components/Grade";
import { Vignette } from "../../components/Vignette";
import { CameraPunch } from "../../components/CameraPunch";
import { HudOverlay } from "../../components/HudOverlay";

export const YtZeroKnowledgeArchitectureScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const introSpring = spring({ frame, fps, config: theme.spring.smooth });

  // Shield lock spring at frame 60
  const shieldSpring = spring({ frame: frame - 60, fps, config: theme.spring.bouncy });

  return (
    <CameraPunch hitFrames={[60, 180]}>
      <AbsoluteFill style={{ backgroundColor: theme.colors.bg, overflow: "hidden", fontFamily: theme.fonts.display }}>
        <BgMesh accentColor="#10B981" />

        {frame === 60 && <Audio src={staticFile("sfx/bass.wav")} volume={1.0} />}
        {frame === 180 && <Audio src={staticFile("sfx/pop.wav")} volume={0.8} />}

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
            ZERO-KNOWLEDGE PRIVACY CONTRACT
          </span>
        </div>

        {/* Center Content */}
        <div
          style={{
            position: "absolute",
            top: "52%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${introSpring})`,
            width: 1300,
            textAlign: "center",
          }}
        >
          {/* Big Glowing Shield */}
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.15)",
              border: "2px solid #10B981",
              margin: "0 auto 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${shieldSpring})`,
              boxShadow: "0 0 50px rgba(16, 185, 129, 0.4)",
            }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>

          <h2 style={{ fontSize: 56, fontWeight: 900, color: theme.colors.text, letterSpacing: "-0.03em", marginBottom: 16 }}>
            0 Bytes Egress. Absolutely No Servers.
          </h2>

          <p style={{ fontSize: 22, color: theme.colors.textDim, maxWidth: 880, margin: "0 auto 48px", lineHeight: 1.5 }}>
            Your Aadhaar, passport, and signature never leave your device. All image transformations execute in client-side WebAssembly.
          </p>

          {/* 3 Verification Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
            <div
              style={{
                background: "rgba(24, 24, 29, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 20,
                padding: 32,
                boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>🛡️</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: theme.colors.text, marginBottom: 8 }}>
                Strict Client Isolation
              </div>
              <div style={{ fontSize: 15, color: theme.colors.textDim, lineHeight: 1.5 }}>
                Content Security Policy strictly blocks outbound media network requests.
              </div>
            </div>

            <div
              style={{
                background: "rgba(24, 24, 29, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 20,
                padding: 32,
                boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: theme.colors.text, marginBottom: 8 }}>
                Offline PWA Capable
              </div>
              <div style={{ fontSize: 15, color: theme.colors.textDim, lineHeight: 1.5 }}>
                Install directly on your desktop or phone. Works smoothly with zero internet connection.
              </div>
            </div>

            <div
              style={{
                background: "rgba(24, 24, 29, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: 20,
                padding: 32,
                boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔓</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: theme.colors.text, marginBottom: 8 }}>
                100% Open Source
              </div>
              <div style={{ fontSize: 15, color: theme.colors.textDim, lineHeight: 1.5 }}>
                MIT Licensed. Complete transparency on GitHub. Free forever with no limits.
              </div>
            </div>
          </div>
        </div>

        <HudOverlay label="PRESSZERO YOUTUBE MASTER // CH.06 ZERO KNOWLEDGE" />
        <Grade />
        <Vignette />
        <Grain />
      </AbsoluteFill>
    </CameraPunch>
  );
};
