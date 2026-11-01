import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { theme } from "../../theme";
import { BgMesh } from "../../components/BgMesh";
import { Grain } from "../../components/Grain";
import { Grade } from "../../components/Grade";
import { Vignette } from "../../components/Vignette";
import { CameraPunch } from "../../components/CameraPunch";
import { HudOverlay } from "../../components/HudOverlay";
import { ApertureLogo } from "../../components/ApertureLogo";

export const YtOutroCtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const introSpring = spring({ frame, fps, config: theme.spring.bouncy });

  // Domain pill pulse
  const pillScale = interpolate(frame, [40, 80, 120, 160], [1, 1.04, 1, 1.04], {
    extrapolateRight: "clamp",
  });

  return (
    <CameraPunch hitFrames={[30, 90]}>
      <AbsoluteFill style={{ backgroundColor: theme.colors.bg, overflow: "hidden", fontFamily: theme.fonts.display }}>
        <BgMesh accentColor="#10B981" />

        {frame === 30 && <Audio src={staticFile("sfx/bass.wav")} volume={1.0} />}
        {frame === 90 && <Audio src={staticFile("sfx/whoosh.wav")} volume={0.8} />}

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${introSpring})`,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Logo animation */}
          <div style={{ marginBottom: 28 }}>
            <ApertureLogo size={140} showWordmark={true} />
          </div>

          <h1 style={{ fontSize: 64, fontWeight: 900, color: theme.colors.text, letterSpacing: "-0.03em", marginBottom: 16 }}>
            Never Get Rejected By a Portal Again.
          </h1>

          <p style={{ fontSize: 24, color: theme.colors.textDim, marginBottom: 36 }}>
            100% Free · 0 Bytes Egress · No Sign Up Required
          </p>

          {/* Glowing Domain Pill */}
          <div
            style={{
              padding: "18px 48px",
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              borderRadius: 9999,
              color: "#08080A",
              fontSize: 32,
              fontWeight: 900,
              letterSpacing: "0.04em",
              boxShadow: "0 0 50px rgba(16, 185, 129, 0.6)",
              transform: `scale(${pillScale})`,
              marginBottom: 28,
            }}
          >
            presszero.antideploy.app
          </div>

          <div
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: 16,
              color: theme.colors.textMuted,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>⭐ Star on GitHub:</span>
            <span style={{ color: theme.colors.text }}>github.com/soumyadeepsarkar-2004/PressZero</span>
          </div>
        </div>

        <HudOverlay label="PRESSZERO YOUTUBE MASTER // CH.07 GET STARTED" />
        <Grade />
        <Vignette />
        <Grain />
      </AbsoluteFill>
    </CameraPunch>
  );
};
