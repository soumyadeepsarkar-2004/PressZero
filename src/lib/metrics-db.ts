import fs from "fs/promises";
import path from "path";
import { Pool } from "pg";

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

// Global singleton pool for Postgres connections in serverless / Node runtime
let pgPool: Pool | null = null;

function getPgPool(): Pool | null {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return null;

  if (!pgPool) {
    try {
      pgPool = new Pool({
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false },
        max: 5,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });
    } catch (err) {
      console.warn("Failed to create Postgres pool, falling back to file DB:", err);
      pgPool = null;
    }
  }
  return pgPool;
}

// In-memory cache for fast read access
let memoryCache: MetricsRecord | null = null;
let writeQueue: Promise<void> = Promise.resolve();

function getDbPaths() {
  const dataDir = path.join(process.cwd(), "data");
  const dbFile = path.join(dataDir, "metrics.json");
  return { dataDir, dbFile };
}

/**
 * Ensures the data directory and metrics.json file exist for local fallback.
 */
async function ensureFileDbInitialized(): Promise<MetricsRecord> {
  const { dataDir, dbFile } = getDbPaths();

  try {
    await fs.mkdir(dataDir, { recursive: true });
    const content = await fs.readFile(/*turbopackIgnore: true*/ dbFile, "utf-8");
    const parsed = JSON.parse(content) as MetricsRecord;

    if (
      typeof parsed.totalCompressions === "number" &&
      typeof parsed.totalDownloads === "number"
    ) {
      memoryCache = parsed;
      return parsed;
    }
  } catch {
    // If file doesn't exist or is corrupted, initialize with zeros
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
 * Get current verified telemetry metrics from database (Postgres with File fallback).
 */
export async function getMetrics(): Promise<ComputedMetrics> {
  const pool = getPgPool();

  if (pool) {
    try {
      const res = await pool.query(
        "SELECT total_compressions, total_downloads, total_processing_time_ms, last_updated, created_at FROM operational_metrics WHERE key = 'global_stats'"
      );

      if (res.rows.length > 0) {
        const row = res.rows[0];
        const totalCompressions = Number(row.total_compressions) || 0;
        const totalDownloads = Number(row.total_downloads) || 0;
        const totalProcessingTimeMs = Number(row.total_processing_time_ms) || 0;

        const averageConvergenceMs =
          totalCompressions > 0 && totalProcessingTimeMs > 0
            ? Math.round((totalProcessingTimeMs / totalCompressions) * 10) / 10
            : 0;

        const record: ComputedMetrics = {
          totalCompressions,
          totalDownloads,
          zeroEgressBytesVerified: 0,
          totalProcessingTimeMs,
          lastUpdated: row.last_updated ? new Date(row.last_updated).toISOString() : null,
          createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
          version: "1.0.0",
          averageConvergenceMs,
        };

        memoryCache = record;
        return record;
      }
    } catch (err) {
      console.warn("Postgres query failed, falling back to local file DB:", err);
    }
  }

  // Fallback to local persistent JSON DB
  const record = memoryCache ?? (await ensureFileDbInitialized());
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
  const pool = getPgPool();

  if (pool) {
    try {
      const incCompressions = action === "compression" ? 1 : 0;
      const incDownloads = action === "download" ? 1 : 0;
      const incDuration =
        action === "compression" && typeof durationMs === "number" && durationMs > 0 && durationMs < 60000
          ? Math.round(durationMs)
          : 0;

      const res = await pool.query(
        `UPDATE operational_metrics
         SET 
           total_compressions = total_compressions + $1,
           total_downloads = total_downloads + $2,
           total_processing_time_ms = total_processing_time_ms + $3,
           last_updated = NOW()
         WHERE key = 'global_stats'
         RETURNING total_compressions, total_downloads, total_processing_time_ms, last_updated, created_at`,
        [incCompressions, incDownloads, incDuration]
      );

      if (res.rows.length > 0) {
        const row = res.rows[0];
        const totalCompressions = Number(row.total_compressions) || 0;
        const totalDownloads = Number(row.total_downloads) || 0;
        const totalProcessingTimeMs = Number(row.total_processing_time_ms) || 0;

        const averageConvergenceMs =
          totalCompressions > 0 && totalProcessingTimeMs > 0
            ? Math.round((totalProcessingTimeMs / totalCompressions) * 10) / 10
            : 0;

        const updated: ComputedMetrics = {
          totalCompressions,
          totalDownloads,
          zeroEgressBytesVerified: 0,
          totalProcessingTimeMs,
          lastUpdated: row.last_updated ? new Date(row.last_updated).toISOString() : new Date().toISOString(),
          createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
          version: "1.0.0",
          averageConvergenceMs,
        };

        memoryCache = updated;
        return updated;
      }
    } catch (err) {
      console.warn("Postgres update failed, falling back to local file DB:", err);
    }
  }

  // Fallback to local persistent JSON DB
  await ensureFileDbInitialized();

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
        console.error("File database persist error:", err);
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
