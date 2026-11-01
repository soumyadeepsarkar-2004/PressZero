import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { theme } from "../../theme";
import { BgMesh } from "../../components/BgMesh";
import { Grain } from "../../components/Grain";
import { Grade } from "../../components/Grade";
import { Vignette } from "../../components/Vignette";
import { CameraPunch } from "../../components/CameraPunch";
import { HudOverlay } from "../../components/HudOverlay";

export const YtHookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for main card
  const cardSpring = spring({ frame, fps, config: theme.spring.smooth });

  // Rejection stamp slam at frame 60
  const stampSpring = spring({
    frame: frame - 60,
    fps,
    config: { damping: 9, stiffness: 220, mass: 0.8 },
  });

  // Portal badges reveal
  const badgesSpring = spring({ frame: frame - 110, fps, config: theme.spring.snappy });

  return (
    <CameraPunch hitFrames={[60, 140]}>
      <AbsoluteFill style={{ backgroundColor: theme.colors.bg, overflow: "hidden", fontFamily: theme.fonts.display }}>
        <BgMesh accentColor="#EF4444" />

        {/* Audio hits */}
        {frame === 0 && <Audio src={staticFile("sfx/whoosh.wav")} volume={0.8} />}
        {frame === 60 && <Audio src={staticFile("sfx/bass.wav")} volume={1.0} />}
        {frame === 110 && <Audio src={staticFile("sfx/pop.wav")} volume={0.6} />}

        {/* Top Header Badge */}
        <div
          style={{
            position: "absolute",
            top: 60,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 24px",
            background: "rgba(239, 68, 68, 0.12)",
            border: "1px solid rgba(239, 68, 68, 0.4)",
            borderRadius: 9999,
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#EF4444", boxShadow: "0 0 10px #EF4444" }} />
          <span style={{ fontSize: 16, fontWeight: 700, color: "#FCA5A5", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            PORTAL UPLOAD FAILURE SIMULATION
          </span>
        </div>

        {/* Central Problem Stage */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${cardSpring})`,
            width: 1200,
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: 40,
            alignItems: "center",
          }}
        >
          {/* Left: Rejection Notice Box */}
          <div
            style={{
              background: "rgba(24, 24, 29, 0.85)",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              borderRadius: 20,
              padding: 36,
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6)",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#EF4444" }} />
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#F59E0B" }} />
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#10B981" }} />
              <span style={{ marginLeft: "auto", fontFamily: theme.fonts.mono, fontSize: 13, color: theme.colors.textMuted }}>
                gov-portal-upload-error.log
              </span>
            </div>

            <div style={{ fontFamily: theme.fonts.mono, fontSize: 28, fontWeight: 800, color: "#EF4444", marginBottom: 16 }}>
              HTTP 413: PAYLOAD TOO LARGE
            </div>

            <div style={{ fontSize: 18, color: theme.colors.textDim, lineHeight: 1.6, marginBottom: 28 }}>
              Uploaded image exceeds strict portal ceiling.
              <br />
              <span style={{ color: "#F87171", fontWeight: 700 }}>Required: Max 50.0 KB</span> (Aspect: 3.5cm × 4.5cm)
              <br />
              <span style={{ color: theme.colors.textMuted }}>Detected: 4,850.4 KB (100x over limit)</span>
            </div>

            {/* Simulated file bar */}
            <div style={{ background: "rgba(0,0,0,0.5)", borderRadius: 10, padding: "14px 18px", border: "1px solid #333" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: theme.colors.textDim, marginBottom: 8 }}>
                <span>passport_photo_raw.jpg</span>
                <span style={{ color: "#EF4444", fontWeight: 700 }}>REJECTED</span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: "100%", height: "100%", background: "#EF4444" }} />
              </div>
            </div>

            {/* Slamming REJECTED Stamp */}
            {frame >= 60 && (
              <div
                style={{
                  position: "absolute",
                  top: "35%",
                  right: -25,
                  transform: `rotate(-14deg) scale(${stampSpring})`,
                  border: "6px solid #EF4444",
                  color: "#EF4444",
                  padding: "12px 32px",
                  fontSize: 48,
                  fontWeight: 900,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  borderRadius: 16,
                  background: "rgba(239, 68, 68, 0.15)",
                  backdropFilter: "blur(6px)",
                  boxShadow: "0 0 40px rgba(239, 68, 68, 0.4)",
                }}
              >
                REJECTED
              </div>
            )}
          </div>

          {/* Right: Punchy Big Typography Headline */}
          <div>
            <h1
              style={{
                fontSize: 62,
                fontWeight: 900,
                color: theme.colors.text,
                lineHeight: 1.15,
                marginBottom: 24,
                letterSpacing: "-0.03em",
              }}
            >
              Why Do Government Portals{" "}
              <span style={{ color: "#EF4444", textDecoration: "underline", textDecorationColor: "rgba(239,68,68,0.5)" }}>
                Always Reject
              </span>{" "}
              Your Uploads?
            </h1>

            <p style={{ fontSize: 24, color: theme.colors.textDim, lineHeight: 1.5, marginBottom: 36 }}>
              You take a photo with your phone. It is 5 MB. The portal demands under 50 KB, pure white background, and exact dimensions.
            </p>

            {/* Supported Portals Pill Carousel */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                opacity: badgesSpring,
                transform: `translateY(${(1 - badgesSpring) * 20}px)`,
              }}
            >
              {["UPSC & SSC", "US Visa (DS-160)", "Schengen Visa", "Passport Seva", "NTA & NEET", "IBPS Banking"].map((item) => (
                <div
                  key={item}
                  style={{
                    padding: "8px 18px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: 9999,
                    fontSize: 15,
                    fontWeight: 600,
                    color: theme.colors.text,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <HudOverlay label="PRESSZERO YOUTUBE MASTER // CH.01 UPLOAD BOTTLENECK" />
        <Grade />
        <Vignette />
        <Grain />
      </AbsoluteFill>
    </CameraPunch>
  );
};
