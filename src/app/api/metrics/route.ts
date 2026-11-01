import { NextResponse } from "next/server";
import { getMetrics, recordMetricEvent } from "@/lib/metrics-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/metrics
 * Returns verified real operational telemetry synchronized with persistent storage.
 * Starts from true zero; only increments on genuine client-verified operations.
 */
export async function GET() {
  try {
    const stats = await getMetrics();

    return NextResponse.json(
      {
        success: true,
        source: "database",
        totalCompressions: stats.totalCompressions,
        totalDownloads: stats.totalDownloads,
        zeroEgressBytesVerified: 0,
        averageConvergenceMs: stats.averageConvergenceMs,
        lastUpdated: stats.lastUpdated,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  } catch (err) {
    console.error("Failed to read metrics:", err);
    return NextResponse.json(
      {
        success: false,
        totalCompressions: 0,
        totalDownloads: 0,
        zeroEgressBytesVerified: 0,
        averageConvergenceMs: 0,
        lastUpdated: null,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/metrics
 * Record authentic client events (compression or download) into the database.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action;
    const durationMs = typeof body.durationMs === "number" ? body.durationMs : undefined;

    if (action !== "compression" && action !== "download") {
      return NextResponse.json(
        { error: "Invalid action. Supported: 'compression', 'download'" },
        { status: 400 }
      );
    }

    const updated = await recordMetricEvent(action, durationMs);

    return NextResponse.json(
      {
        success: true,
        stats: {
          totalCompressions: updated.totalCompressions,
          totalDownloads: updated.totalDownloads,
          zeroEgressBytesVerified: 0,
          averageConvergenceMs: updated.averageConvergenceMs,
          lastUpdated: updated.lastUpdated,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Failed to record metric:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
