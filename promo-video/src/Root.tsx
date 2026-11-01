import React from "react";
import { Composition, Series, Audio, staticFile } from "remotion";
import { HookScene } from "./scenes/HookScene";
import { EngineScene } from "./scenes/EngineScene";
import { BleachScene } from "./scenes/BleachScene";
import { PassportCropScene } from "./scenes/PassportCropScene";
import { ZeroKnowledgeCtaScene } from "./scenes/ZeroKnowledgeCtaScene";

// YouTube 16:9 Long-Form Explainer Scenes
import { YtHookScene } from "./scenes/youtube/YtHookScene";
import { YtPrivacyProblemScene } from "./scenes/youtube/YtPrivacyProblemScene";
import { YtEngineDeepDiveScene } from "./scenes/youtube/YtEngineDeepDiveScene";
import { YtBleachDemoScene } from "./scenes/youtube/YtBleachDemoScene";
import { YtBiometricCropScene } from "./scenes/youtube/YtBiometricCropScene";
import { YtZeroKnowledgeArchitectureScene } from "./scenes/youtube/YtZeroKnowledgeArchitectureScene";
import { YtOutroCtaScene } from "./scenes/youtube/YtOutroCtaScene";

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

// Comprehensive 16:9 YouTube Long Explainer Sequence (1,710 frames = 57.0s)
const YoutubeExplainerSequence: React.FC = () => {
  return (
    <>
      <Audio src={staticFile("sfx/track.wav")} volume={0.25} loop />

      <Series>
        {/* 1. The Portal Rejection Bottleneck (0:00 - 0:06) */}
        <Series.Sequence durationInFrames={180}>
          <YtHookScene />
        </Series.Sequence>

        {/* 2. The Cloud Compressor Privacy Trap (0:06 - 0:14) */}
        <Series.Sequence durationInFrames={240}>
          <YtPrivacyProblemScene />
        </Series.Sequence>

        {/* 3. Exact Target-KB Bisection Deep Dive (0:14 - 0:25) */}
        <Series.Sequence durationInFrames={330}>
          <YtEngineDeepDiveScene />
        </Series.Sequence>

        {/* 4. Instant AI Signature Bleach Demo (0:25 - 0:34) */}
        <Series.Sequence durationInFrames={270}>
          <YtBleachDemoScene />
        </Series.Sequence>

        {/* 5. Biometric Passport & Visa Cropper (0:34 - 0:43) */}
        <Series.Sequence durationInFrames={270}>
          <YtBiometricCropScene />
        </Series.Sequence>

        {/* 6. Zero-Knowledge Client Architecture (0:43 - 0:51) */}
        <Series.Sequence durationInFrames={240}>
          <YtZeroKnowledgeArchitectureScene />
        </Series.Sequence>

        {/* 7. Outro & Call to Action (0:51 - 0:57) */}
        <Series.Sequence durationInFrames={180}>
          <YtOutroCtaScene />
        </Series.Sequence>
      </Series>
    </>
  );
};

export const Root: React.FC = () => {
  return (
    <>
      {/* 9:16 Vertical Reel / Short / Story Composition (18s) */}
      <Composition
        id="PressZeroPromo"
        component={MainPromoSequence}
        durationInFrames={540}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* 16:9 Landscape Promo (18s) */}
      <Composition
        id="PressZeroPromoLandscape"
        component={MainPromoSequence}
        durationInFrames={540}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 16:9 Long-Form YouTube Explainer / Showcase Video (57s) */}
      <Composition
        id="PressZeroYouTubeExplainer"
        component={YoutubeExplainerSequence}
        durationInFrames={1710}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
