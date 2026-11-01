import React from "react";
import { Composition, Series, Audio, staticFile } from "remotion";
import { HookScene } from "./scenes/HookScene";
import { EngineScene } from "./scenes/EngineScene";
import { BleachScene } from "./scenes/BleachScene";
import { PassportCropScene } from "./scenes/PassportCropScene";
import { ZeroKnowledgeCtaScene } from "./scenes/ZeroKnowledgeCtaScene";

const MainPromoSequence: React.FC = () => {
  return (
    <>
      {/* Background Synth Music Bed (ducked low so SFX pops) */}
      <Audio src={staticFile("sfx/track.wav")} volume={0.28} loop />

      <Series>
        {/* 1. Hook & Aperture Sting (0s - 3.0s) */}
        <Series.Sequence durationInFrames={90}>
          <HookScene />
        </Series.Sequence>

        {/* 2. Target-KB Engine Bisection Simulation (3.0s - 6.66s) */}
        <Series.Sequence durationInFrames={110}>
          <EngineScene />
        </Series.Sequence>

        {/* 3. AI Signature Bleach Filter (6.66s - 10.33s) */}
        <Series.Sequence durationInFrames={110}>
          <BleachScene />
        </Series.Sequence>

        {/* 4. Biometric Cropper & Aspect Ratio Guard (10.33s - 14.0s) */}
        <Series.Sequence durationInFrames={110}>
          <PassportCropScene />
        </Series.Sequence>

        {/* 5. Zero-Knowledge Privacy & Call to Action (14.0s - 18.0s) */}
        <Series.Sequence durationInFrames={120}>
          <ZeroKnowledgeCtaScene />
        </Series.Sequence>
      </Series>
    </>
  );
};

export const Root: React.FC = () => {
  return (
    <>
      {/* 9:16 Vertical Reel / Short / Story Composition */}
      <Composition
        id="PressZeroPromo"
        component={MainPromoSequence}
        durationInFrames={540}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* 16:9 Landscape Composition */}
      <Composition
        id="PressZeroPromoLandscape"
        component={MainPromoSequence}
        durationInFrames={540}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
