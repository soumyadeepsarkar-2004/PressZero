import { Easing } from "remotion";

export const theme = {
  colors: {
    bg: "#08080A",
    bgAlt: "#101014",
    surface: "#18181D",
    surfaceElevated: "#22222A",
    border: "#282832",
    borderGlow: "rgba(255, 255, 255, 0.15)",
    
    // Core high contrast text
    text: "#FFFFFF",
    textDim: "#A1A1AA",
    textMuted: "#71717A",
    
    // Brand Hero Accent
    hero: "#FFFFFF",
    accentEmerald: "#10B981", // Zero-knowledge privacy & pass guarantee
    accentCyan: "#06B6D4",    // Bisection caliper high-precision
    accentAmber: "#F59E0B",   // Warning / target delta
    
    glow: "rgba(255, 255, 255, 0.25)",
    emeraldGlow: "rgba(16, 185, 129, 0.35)",
  },
  fonts: {
    display: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Courier New', monospace",
  },
  // The easing curves (Rule 1: Linear is forbidden)
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),      // easeOutExpo for entrances
    inOut: Easing.bezier(0.83, 0, 0.17, 1),   // easeInOutQuint for pans / sweeps
    in: Easing.bezier(0.7, 0, 0.84, 0),       // exits only
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 }, // UI pops, words, tags
    smooth: { damping: 20, stiffness: 90, mass: 1 },    // Cards, hero panels
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },  // Caliper snaps, logo
  },
} as const;
