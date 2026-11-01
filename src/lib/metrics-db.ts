import fs from "fs/promises";
import path from "path";

export interface MetricsRecord {
  totalCompressions: number;
  totalDownloads: number;
  zeroEgressBytesVerified: number;
  totalProcessingTimeMs: number;
  lastUpdated: string | null;
  createdAt: string;
  version: string;
}

export interface ComputedMetrics extends MetricsRecord {
  averageConvergenceMs: number;
}

const DEFAULT_METRICS: MetricsRecord = {
  totalCompressions: 0,
  totalDownloads: 0,
  zeroEgressBytesVerified: 0,
  totalProcessingTimeMs: 0,
  lastUpdated: null,
  createdAt: "2026-11-01T00:00:00.000Z",
  version: "1.0.0",
};

// In-memory cache for fast read access
let memoryCache: MetricsRecord | null = null;
let writeQueue: Promise<void> = Promise.resolve();

function getDbPaths() {
  const dataDir = path.join(process.cwd(), "data");
  const dbFile = path.join(dataDir, "metrics.json");
  return { dataDir, dbFile };
}

/**
 * Ensures the data directory and metrics.json file exist.
 */
async function ensureDbInitialized(): Promise<MetricsRecord> {
  const { dataDir, dbFile } = getDbPaths();

  try {
    await fs.mkdir(dataDir, { recursive: true });
    const content = await fs.readFile(/*turbopackIgnore: true*/ dbFile, "utf-8");
    const parsed = JSON.parse(content) as MetricsRecord;

    // Validate structure
    if (
      typeof parsed.totalCompressions === "number" &&
      typeof parsed.totalDownloads === "number"
    ) {
      memoryCache = parsed;
      return parsed;
    }
  } catch {
    // If file doesn't exist or is corrupted, write initial empty state (all zeros)
  }

  const initial = { ...DEFAULT_METRICS, createdAt: new Date().toISOString() };
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(/*turbopackIgnore: true*/ dbFile, JSON.stringify(initial, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write initial metrics file to disk:", err);
  }

  memoryCache = initial;
  return initial;
}

/**
 * Get current verified telemetry metrics from database.
 */
export async function getMetrics(): Promise<ComputedMetrics> {
  const record = memoryCache ?? (await ensureDbInitialized());

  const averageConvergenceMs =
    record.totalCompressions > 0 && record.totalProcessingTimeMs > 0
      ? Math.round((record.totalProcessingTimeMs / record.totalCompressions) * 10) / 10
      : 0;

  return {
    ...record,
    averageConvergenceMs,
  };
}

/**
 * Record a real event (compression or download) and persist to database.
 */
export async function recordMetricEvent(
  action: "compression" | "download",
  durationMs?: number
): Promise<ComputedMetrics> {
  // Ensure database initialized
  await ensureDbInitialized();

  // Queue writes sequentially to prevent file clobbering
  return new Promise((resolve, reject) => {
    writeQueue = writeQueue.then(async () => {
      try {
        const current = memoryCache || { ...DEFAULT_METRICS };

        if (action === "compression") {
          current.totalCompressions += 1;
          if (typeof durationMs === "number" && durationMs > 0 && durationMs < 60000) {
            current.totalProcessingTimeMs += durationMs;
          }
        } else if (action === "download") {
          current.totalDownloads += 1;
        }

        current.lastUpdated = new Date().toISOString();
        memoryCache = current;

        // Persist to filesystem
        const { dbFile } = getDbPaths();
        await fs.writeFile(/*turbopackIgnore: true*/ dbFile, JSON.stringify(current, null, 2), "utf-8");

        const averageConvergenceMs =
          current.totalCompressions > 0 && current.totalProcessingTimeMs > 0
            ? Math.round((current.totalProcessingTimeMs / current.totalCompressions) * 10) / 10
            : 0;

        resolve({
          ...current,
          averageConvergenceMs,
        });
      } catch (err) {
        console.error("Database persist error:", err);
        // Fall back gracefully with updated memory state
        const fallback = memoryCache || { ...DEFAULT_METRICS };
        const averageConvergenceMs =
          fallback.totalCompressions > 0 && fallback.totalProcessingTimeMs > 0
            ? Math.round((fallback.totalProcessingTimeMs / fallback.totalCompressions) * 10) / 10
            : 0;
        resolve({
          ...fallback,
          averageConvergenceMs,
        });
      }
    }).catch(reject);
  });
}
