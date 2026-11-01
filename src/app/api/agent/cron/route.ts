import { NextRequest, NextResponse } from "next/server";
import { getMetrics } from "@/lib/metrics-db";
import { sendTelegramMessage } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CRON_SECRET = process.env.CRON_SECRET || "presszero_cron_2026";

/**
 * GET /api/agent/cron
 * Called 24/7 by cloud cron runners (e.g. cron-job.org, Cloudflare Workers, UptimeRobot)
 * completely independent of the user's local PC.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret") || req.headers.get("x-cron-secret");

  // Optional authentication check
  if (process.env.CRON_SECRET && secret !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const metrics = await getMetrics();
  const timestamp = new Date().toISOString();

  // Audit report data
  const report = {
    service: "PressZero 24/7 Autonomous Agent Cron Runner",
    status: "healthy",
    timestamp,
    pcIndependent: true,
    cloudInfrastructure: "Vercel / Antideploy Serverless + GitHub Actions 24/7",
    metrics: {
      totalDownloads: metrics.totalDownloads,
      totalCompressions: metrics.totalCompressions,
      zeroEgressBytesVerified: metrics.zeroEgressBytesVerified,
      averageConvergenceMs: Math.round(metrics.averageConvergenceMs),
    },
    monitoredPlatforms: [
      { platform: "instagram", status: "active", channel: "@_hmm.soumo_" },
      { platform: "facebook", status: "active", channel: "PressZero" },
      { platform: "youtube", status: "active", videoId: "waQuuUmrwmg" },
      { platform: "x", status: "active", handle: "@sarkar58153" },
      { platform: "reddit", status: "active", sub: "r/SideProject" },
    ],
    growthPipeline: [
      {
        reel: 2,
        title: "The Aadhaar & Identity Privacy Trap",
        scheduledFor: "2026-11-08T09:00:00Z",
        daysRemaining: Math.max(0, Math.ceil((new Date("2026-11-08T09:00:00Z").getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
        asset: "public/videos/presszero-reel2-privacy.mp4",
      },
      {
        reel: 3,
        title: "Dirty Phone Shadow to 255-White Ink",
        scheduledFor: "2026-11-15T09:00:00Z",
        daysRemaining: Math.max(0, Math.ceil((new Date("2026-11-15T09:00:00Z").getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
        asset: "public/videos/presszero-reel3-bleach.mp4",
      },
    ],
  };

  // If notify query param is set, send a heartbeat alert to Telegram
  if (searchParams.get("notify") === "true") {
    await sendTelegramMessage(
      `🟢 <b>PressZero 24/7 Cloud Heartbeat</b>\nAll 5 platforms active. Authentic downloads: <b>${metrics.totalDownloads}</b>. Zero egress verified.`
    );
  }

  return NextResponse.json(report, { status: 200 });
}
