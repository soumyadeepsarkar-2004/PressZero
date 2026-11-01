/**
 * Anonymous operational event telemetry for PressZero.
 * 
 * Strict Privacy Guarantees:
 * - NEVER sends image pixels, file bytes, metadata, filenames, or user identity.
 * - Only records an anonymous operational count to synchronize the public dashboard with the database.
 */

export function trackCompression(durationMs?: number): void {
  try {
    if (typeof window !== "undefined" && typeof fetch === "function") {
      fetch("/api/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "compression", durationMs }),
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Silently proceed
  }
}

export function trackDownload(): void {
  try {
    if (typeof window !== "undefined" && typeof fetch === "function") {
      fetch("/api/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "download" }),
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Silently proceed
  }
}
