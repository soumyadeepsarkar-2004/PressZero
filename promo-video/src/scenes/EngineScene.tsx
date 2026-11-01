import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Audio, staticFile } from "remotion";
import { BgMesh } from "../components/BgMesh";
import { Grade } from "../components/Grade";
import { Grain } from "../components/Grain";
import { Vignette } from "../components/Vignette";
import { WordReveal } from "../components/WordReveal";
import { Entrance } from "../components/Entrance";
import { KenBurns } from "../components/KenBurns";
import { CameraPunch } from "../components/CameraPunch";
import { HudOverlay } from "../components/HudOverlay";
import { theme } from "../theme";

export const EngineScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Fast exit transition
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames - 2],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Dynamic counter: simulate bisection search from 4,850 KB down to 49.8 KB
  const countProgress = spring({
    frame: frame - 18,
    fps,
    config: { damping: 20, stiffness: 90, mass: 0.9 },
  });

  const rawSizeKb = interpolate(countProgress, [0, 1], [4850, 49.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const displayKb = rawSizeKb > 100 ? Math.round(rawSizeKb) : rawSizeKb.toFixed(1);

  // Locked badge snap at frame 55
  const lockedBadgePop = spring({
    frame: frame - 55,
    fps,
    config: theme.spring.bouncy,
  });

  return (
    <CameraPunch hitFrames={[18, 55]}>
      <AbsoluteFill style={{ opacity: exitOpacity }}>
        {/* Layer 1: Background Mesh */}
        <BgMesh accentColor={theme.colors.accentCyan} />

        {/* High-Tech HUD Layer */}
        <HudOverlay label="BISECTION ENGINE // DUAL-AXIS SEARCH" />

        {/* Layer 2: Asset screenshot with Ken Burns */}
        <div
          style={{
            position: "absolute",
            top: "46%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 960,
            height: 600,
            borderRadius: 24,
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            boxShadow: "0 40px 100px -20px rgba(0, 0, 0, 0.85)",
            opacity: interpolate(frame, [5, 18], [0, 0.45], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <KenBurns
            src="assets/03-interactive-demo-sandbox.png"
            zoomFrom={1.02}
            zoomTo={1.12}
            panX={-20}
          />
        </div>

        {/* Layer 3: Graphics & Typography */}
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
                  color: theme.colors.accentCyan,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontFamily: theme.fonts.mono,
                }}
              >
                Binary Search Convergence
              </span>
            </Entrance>

            <div style={{ marginTop: 12 }}>
              <WordReveal
                text="Exact Target-KB Engine"
                delay={6}
                perWordFrames={3}
                highlightWord="Exact"
                highlightColor={theme.colors.accentCyan}
                style={{
                  fontSize: 70,
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  color: theme.colors.text,
                }}
              />
            </div>
            <Entrance delay={16} direction="up" distance={16}>
              <p style={{ marginTop: 10, fontSize: 26, color: theme.colors.textDim }}>
                Dual-axis bisection calibrates dimensions and quality to hit the exact byte ceiling.
              </p>
            </Entrance>
          </div>

          {/* Center Calibrator Instrument Console */}
          <Entrance delay={14} direction="up" distance={30} scaleFrom={0.92} preset="bouncy">
            <div
              style={{
                position: "relative",
                width: 940,
                padding: "44px 48px",
                borderRadius: 28,
                backgroundColor: "rgba(14, 14, 20, 0.95)",
                border: "2px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 30px 90px rgba(0, 0, 0, 0.85)",
                backdropFilter: "blur(24px)",
                display: "flex",
                flexDirection: "column",
                gap: 32,
              }}
            >
              {/* Target vs Output readout row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: 16,
                      color: theme.colors.textMuted,
                      fontFamily: theme.fonts.mono,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Target Bound (UPSC / NTA)
                  </span>
                  <div
                    style={{
                      fontSize: 56,
                      fontWeight: 900,
                      color: theme.colors.text,
                      fontFamily: theme.fonts.mono,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    50.0 <span style={{ fontSize: 26, color: theme.colors.textDim }}>KB</span>
                  </div>
                </div>

                {/* Compressed live output */}
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      fontSize: 16,
                      color: theme.colors.accentEmerald,
                      fontFamily: theme.fonts.mono,
                      textTransform: "uppercase",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: 8,
                      letterSpacing: "0.05em",
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: theme.colors.accentEmerald,
                        boxShadow: `0 0 12px ${theme.colors.accentEmerald}`,
                      }}
                    />
                    Output Converged
                  </span>
                  <div
                    style={{
                      fontSize: 64,
                      fontWeight: 900,
                      color: theme.colors.accentEmerald,
                      fontFamily: theme.fonts.mono,
                      fontVariantNumeric: "tabular-nums",
                      textShadow: `0 0 32px ${theme.colors.emeraldGlow}`,
                    }}
                  >
                    {displayKb} <span style={{ fontSize: 28 }}>KB</span>
                  </div>
                </div>
              </div>

              {/* Simulated compression caliper slider track */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${interpolate(countProgress, [0, 1], [10, 98])}%`,
                    backgroundColor: theme.colors.accentCyan,
                    boxShadow: `0 0 24px ${theme.colors.accentCyan}`,
                  }}
                />
              </div>

              {/* Precision Telemetry Stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 20,
                  paddingTop: 16,
                  borderTop: "1px solid rgba(255, 255, 255, 0.12)",
                }}
              >
                <div>
                  <div style={{ fontSize: 15, color: theme.colors.textMuted }}>Overshoot</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: theme.colors.text, fontFamily: theme.fonts.mono }}>
                    0 KB
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 15, color: theme.colors.textMuted }}>Speed</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: theme.colors.text, fontFamily: theme.fonts.mono }}>
                    24.8 ms
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 15, color: theme.colors.textMuted }}>Variance</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: theme.colors.accentEmerald, fontFamily: theme.fonts.mono }}>
                    ±0.0%
                  </div>
                </div>
              </div>

              {/* Locked Badge Pop on Frame 55 */}
              {frame >= 55 && (
                <div
                  style={{
                    position: "absolute",
                    top: -16,
                    right: 40,
                    opacity: lockedBadgePop,
                    transform: `scale(${interpolate(lockedBadgePop, [0, 1], [1.3, 1])}) rotate(3deg)`,
                    padding: "8px 22px",
                    borderRadius: 999,
                    backgroundColor: theme.colors.accentEmerald,
                    color: "#000000",
                    fontWeight: 900,
                    fontSize: 15,
                    letterSpacing: "0.08em",
                    fontFamily: theme.fonts.mono,
                    boxShadow: "0 0 30px rgba(16, 185, 129, 0.6)",
                  }}
                >
                  TARGET LOCKED · 49.8 KB
                </div>
              )}
            </div>
          </Entrance>

          {/* Bottom Guarantee Banner */}
          <Entrance delay={38} direction="up" distance={16} preset="snappy">
            <div
              style={{
                padding: "16px 36px",
                borderRadius: 16,
                backgroundColor: "rgba(16, 185, 129, 0.16)",
                border: "1.5px solid rgba(16, 185, 129, 0.45)",
                boxShadow: "0 0 30px rgba(16, 185, 129, 0.2)",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <span style={{ fontSize: 24, color: theme.colors.accentEmerald }}>✓</span>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: theme.colors.text,
                }}
              >
                Guaranteed portal acceptance for UPSC, NTA, SSC & State PSCs
              </span>
            </div>
          </Entrance>
        </AbsoluteFill>

        {/* SFX Audio */}
        <Audio src={staticFile("sfx/whoosh.wav")} startFrom={0} volume={0.65} />
        {frame >= 18 && frame <= 50 && frame % 8 === 0 && (
          <Audio src={staticFile("sfx/tick.wav")} volume={0.5} />
        )}
        {frame >= 55 && <Audio src={staticFile("sfx/bass.wav")} volume={0.85} />}

        {/* Layer 4: Color Grade */}
        <Grade />

        {/* Layer 5: Grain + Vignette */}
        <Grain />
        <Vignette />
      </AbsoluteFill>
    </CameraPunch>
  );
};
