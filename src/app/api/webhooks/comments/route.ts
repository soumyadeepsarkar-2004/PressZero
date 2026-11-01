import { NextRequest, NextResponse } from "next/server";
import { classifyComment } from "@/lib/comment-classifier";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || "presszero_meta_verify_2026";
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

/**
 * GET /api/webhooks/comments
 * Meta Webhook verification handshake (hub.challenge) for Instagram & Facebook.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("[Webhook] Meta verification successful!");
    return new NextResponse(challenge || "ok", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return NextResponse.json(
    {
      service: "PressZero Community & Comment Automation Webhook",
      status: "operational",
      platforms: ["instagram", "facebook", "youtube", "x", "reddit"],
      activeChallenge: false,
    },
    { status: 200 }
  );
}

/**
 * POST /api/webhooks/comments
 * Ingests incoming comment events, classifies intent, generates zero-slop reply,
 * and dispatches live reply if access token is available.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Check for Meta Graph API Webhook structure (Instagram / Facebook)
    let extractedComment = "";
    let senderUser = "user";
    let commentId: string | null = null;
    let platform = "generic";

    if (body.object === "instagram" || body.object === "page") {
      platform = body.object;
      const entry = body.entry?.[0];
      const change = entry?.changes?.[0]?.value;

      if (change) {
        commentId = change.id || null;
        extractedComment = change.text || change.message || "";
        senderUser = change.from?.username || change.from?.name || "user";
      }
    } else {
      // Custom / generic webhook payload
      extractedComment = body.comment || body.text || body.message || "";
      senderUser = body.user || body.username || "user";
      commentId = body.comment_id || body.id || null;
      platform = body.platform || "community";
    }

    if (!extractedComment) {
      return NextResponse.json(
        { success: false, error: "No comment text found in payload" },
        { status: 400 }
      );
    }

    // 2. Classify and generate zero-slop response
    const result = classifyComment(extractedComment, senderUser);

    console.log(`[Webhook] [${platform.toUpperCase()}] @${senderUser}: "${extractedComment}" -> ${result.intent}`);

    // 3. Optional live dispatch to Meta if commentId and META_ACCESS_TOKEN exist
    let liveDispatched = false;
    if (META_ACCESS_TOKEN && commentId && (platform === "instagram" || platform === "page")) {
      try {
        const replyUrl = `https://graph.facebook.com/v21.0/${commentId}/replies`;
        const resp = await fetch(replyUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: result.response,
            access_token: META_ACCESS_TOKEN,
          }),
        });
        if (resp.ok) {
          liveDispatched = true;
          console.log(`[Webhook] Dispatched live reply to Meta comment ${commentId}`);
        } else {
          const errText = await resp.text();
          console.error(`[Webhook] Failed Meta dispatch: ${errText}`);
        }
      } catch (e) {
        console.error("[Webhook] Live dispatch error:", e);
      }
    }

    return NextResponse.json({
      success: true,
      platform,
      commentId,
      sender: senderUser,
      query: extractedComment,
      intent: result.intent,
      confidence: result.confidence,
      language: result.language,
      subTopic: result.subTopic,
      reply: result.response,
      liveDispatched,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("[Webhook Error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
