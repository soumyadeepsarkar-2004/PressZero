import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { theme } from "../theme";

interface EntranceProps {
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  scaleFrom?: number;
  preset?: keyof typeof theme.spring;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Entrance: React.FC<EntranceProps> = ({
  delay = 0,
  direction = "up",
  distance = 36,
  scaleFrom = 0.94,
  preset = "smooth",
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const p = spring({
    frame: frame - delay,
    fps,
    config: theme.spring[preset],
  });

  const opacity = interpolate(p, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let translateX = 0;
  let translateY = 0;

  if (direction === "up") {
    translateY = interpolate(p, [0, 1], [distance, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (direction === "down") {
    translateY = interpolate(p, [0, 1], [-distance, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (direction === "left") {
    translateX = interpolate(p, [0, 1], [distance, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (direction === "right") {
    translateX = interpolate(p, [0, 1], [-distance, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  const scale = interpolate(p, [0, 1], [scaleFrom, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
