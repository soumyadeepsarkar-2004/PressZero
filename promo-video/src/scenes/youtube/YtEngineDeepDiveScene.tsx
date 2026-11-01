import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { theme } from "../../theme";
import { BgMesh } from "../../components/BgMesh";
import { Grain } from "../../components/Grain";
import { Grade } from "../../components/Grade";
import { Vignette } from "../../components/Vignette";
import { CameraPunch } from "../../components/CameraPunch";
import { HudOverlay } from "../../components/HudOverlay";

export const YtEngineDeepDiveScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Bisection steps animation calibrated for 330 frames
  const s1 = spring({ frame: frame - 25, fps, config: theme.spring.snappy });
  const s2 = spring({ frame: frame - 70, fps, config: theme.spring.snappy });
  const s3 = spring({ frame: frame - 120, fps, config: theme.spring.snappy });
  const s4 = spring({ frame: frame - 170, fps, config: theme.spring.snappy });
  const lock = spring({ frame: frame - 220, fps, config: { damping: 10, stiffness: 200, mass: 0.8 } });

  // Current live size readout
  const liveKb = interpolate(
    frame,
    [0, 25, 70, 120, 170, 220],
    [4850, 412, 118, 38, 53, 49.8],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  return (
    <CameraPunch hitFrames={[25, 70, 120, 170, 220]}>
      <AbsoluteFill style={{ backgroundColor: theme.colors.bg, overflow: "hidden", fontFamily: theme.fonts.display }}>
        <BgMesh accentColor="#06B6D4" />

        {frame === 25 && <Audio src={staticFile("sfx/tick.wav")} volume={0.7} />}
        {frame === 70 && <Audio src={staticFile("sfx/tick.wav")} volume={0.7} />}
        {frame === 120 && <Audio src={staticFile("sfx/tick.wav")} volume={0.7} />}
        {frame === 170 && <Audio src={staticFile("sfx/tick.wav")} volume={0.8} />}
        {frame === 220 && <Audio src={staticFile("sfx/bass.wav")} volume={1.0} />}

        {/* Section Header */}
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
            background: "rgba(6, 182, 212, 0.12)",
            border: "1px solid rgba(6, 182, 212, 0.4)",
            borderRadius: 9999,
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#06B6D4" }} />
          <span style={{ fontSize: 16, fontWeight: 700, color: "#67E8F9", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            EXACT TARGET-KB BISECTION ENGINE
          </span>
        </div>

        {/* Main 3-Column Studio Console */}
        <div
          style={{
            position: "absolute",
            top: "52%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 1400,
            display: "grid",
            gridTemplateColumns: "360px 1fr 360px",
            gap: 32,
            alignItems: "stretch",
          }}
        >
          {/* Left Column: Input Telemetry */}
          <div
            style={{
              background: "rgba(24, 24, 29, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 20,
              padding: 28,
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ fontSize: 13, fontFamily: theme.fonts.mono, color: theme.colors.textMuted, marginBottom: 12 }}>
              INPUT PAYLOAD
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: theme.colors.text, marginBottom: 4 }}>
              passport_raw.jpg
            </div>
            <div style={{ fontSize: 15, color: theme.colors.textDim, marginBottom: 24 }}>4000 × 3000 px · RGB</div>

            <div style={{ borderTop: "1px solid #333", paddingTop: 18, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: theme.colors.textMuted }}>Original Size:</span>
                <span style={{ color: "#EF4444", fontFamily: theme.fonts.mono, fontWeight: 700 }}>4,850.4 KB</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: theme.colors.textMuted }}>Portal Ceiling:</span>
                <span style={{ color: "#F59E0B", fontFamily: theme.fonts.mono, fontWeight: 700 }}>≤ 50.0 KB</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: theme.colors.textMuted }}>Overshoot:</span>
                <span style={{ color: "#EF4444", fontFamily: theme.fonts.mono, fontWeight: 700 }}>+9,600%</span>
              </div>
            </div>
          </div>

          {/* Center Column: Live Bisection Ladder */}
          <div
            style={{
              background: "rgba(16, 20, 28, 0.9)",
              border: `1px solid ${frame >= 220 ? "#10B981" : "rgba(6, 182, 212, 0.4)"}`,
              borderRadius: 20,
              padding: 28,
              boxShadow: frame >= 220 ? "0 0 50px rgba(16, 185, 129, 0.25)" : "0 20px 50px rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Live Counter Display */}
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontFamily: theme.fonts.mono, color: theme.colors.accentCyan, letterSpacing: "0.1em" }}>
                CONVERGENCE OUTPUT
              </div>
              <div style={{ fontSize: 68, fontWeight: 900, fontFamily: theme.fonts.mono, color: frame >= 220 ? "#10B981" : theme.colors.text }}>
                {liveKb.toFixed(1)} <span style={{ fontSize: 32, fontWeight: 600 }}>KB</span>
              </div>
            </div>

            {/* Binary Search Steps */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  fontFamily: theme.fonts.mono,
                  opacity: s1,
                }}
              >
                <span>ITERATION 1: Q=50</span>
                <span style={{ color: "#EF4444" }}>412 KB (Upper bound)</span>
              </div>

              <div
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  fontFamily: theme.fonts.mono,
                  opacity: s2,
                }}
              >
                <span>ITERATION 2: Q=25</span>
                <span style={{ color: "#EF4444" }}>118 KB (Upper bound)</span>
              </div>

              <div
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  fontFamily: theme.fonts.mono,
                  opacity: s3,
                }}
              >
                <span>ITERATION 3: Q=12</span>
                <span style={{ color: "#F59E0B" }}>38 KB (Lower bound)</span>
              </div>

              <div
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                  fontFamily: theme.fonts.mono,
                  opacity: s4,
                }}
              >
                <span>ITERATION 4: Q=15</span>
                <span style={{ color: "#10B981" }}>53 KB (Refining window)</span>
              </div>
            </div>

            {/* Target Locked Banner */}
            {frame >= 220 && (
              <div
                style={{
                  marginTop: 16,
                  padding: "12px 20px",
                  background: "rgba(16, 185, 129, 0.2)",
                  border: "1px solid #10B981",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  transform: `scale(${lock})`,
                }}
              >
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10B981" }} />
                <span style={{ color: "#6EE7B7", fontWeight: 800, fontSize: 16, letterSpacing: "0.1em" }}>
                  TARGET LOCKED: 49.8 KB (99.6% ACCURACY IN 64ms)
                </span>
              </div>
            )}
          </div>

          {/* Right Column: Engine Proof */}
          <div
            style={{
              background: "rgba(24, 24, 29, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 20,
              padding: 28,
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontFamily: theme.fonts.mono, color: theme.colors.accentCyan, marginBottom: 12 }}>
                HOW IT WORKS
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: theme.colors.text, marginBottom: 16 }}>
                Binary Search on Quantization Matrix
              </div>
              <p style={{ fontSize: 14, color: theme.colors.textDim, lineHeight: 1.6, margin: 0 }}>
                Instead of forcing you to guess percentages, our Web Worker bisection loop dynamically brackets JPEG/WebP quantization tables to guarantee under-target fit.
              </p>
            </div>

            <div style={{ borderTop: "1px solid #333", paddingTop: 16 }}>
              <div style={{ fontSize: 13, color: "#10B981", fontWeight: 700, marginBottom: 4 }}>
                100% Portal Compliant
              </div>
              <div style={{ fontSize: 12, color: theme.colors.textMuted }}>
                Tested against UPSC, SSC, US DS-160, and Schengen validator engines.
              </div>
            </div>
          </div>
        </div>

        <HudOverlay label="PRESSZERO YOUTUBE MASTER // CH.03 BISECTION ENGINE" />
        <Grade />
        <Vignette />
        <Grain />
      </AbsoluteFill>
    </CameraPunch>
  );
};
