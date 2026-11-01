import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { theme } from "../theme";

interface WordRevealProps {
  text: string;
  delay?: number;
  perWordFrames?: number;
  highlightWord?: string;
  highlightColor?: string;
  style?: React.CSSProperties;
}

export const WordReveal: React.FC<WordRevealProps> = ({
  text,
  delay = 0,
  perWordFrames = 3,
  highlightWord,
  highlightColor = theme.colors.accentEmerald,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        columnGap: "0.28em",
        rowGap: "0.18em",
        lineHeight: 1.1,
        ...style,
      }}
    >
      {words.map((word, i) => {
        const p = spring({
          frame: frame - delay - i * perWordFrames,
          fps,
          config: theme.spring.snappy,
        });

        const opacity = interpolate(p, [0, 1], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const translateY = interpolate(p, [0, 1], [24, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const scale = interpolate(p, [0, 1], [0.92, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const isHighlight =
          highlightWord &&
          word.toLowerCase().replace(/[^a-z0-9]/g, "") ===
            highlightWord.toLowerCase().replace(/[^a-z0-9]/g, "");

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity,
              transform: `translateY(${translateY}px) scale(${scale})`,
              color: isHighlight ? highlightColor : "inherit",
              textShadow: isHighlight
                ? `0 0 24px ${highlightColor}66`
                : "none",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
