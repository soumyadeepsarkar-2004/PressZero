/**
 * PressZero 24/7 Cloudflare Worker Cron Dispatcher
 * Runs 100% free on Cloudflare's global edge network (up to 100,000 requests/day).
 * Completely independent of your personal computer.
 */

export default {
  /**
   * Cron Trigger handler - fired automatically by Cloudflare Edge every 5-10 minutes.
   */
  async scheduled(event, env, ctx) {
    ctx.waitUntil(triggerAgentSweeps(env));
  },

  /**
   * HTTP Fetch handler - allows manual ping or health check via browser.
   */
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/trigger") {
      const result = await triggerAgentSweeps(env);
      return new Response(JSON.stringify(result, null, 2), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        service: "PressZero Cloudflare 24/7 Cron Worker",
        status: "active",
        schedule: "*/5 * * * *",
        edgeLocation: request.cf?.colo || "global",
        pcIndependent: true,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  },
};

async function triggerAgentSweeps(env) {
  const targetUrl =
    env.PRESSZERO_API_URL || "https://presszero.antideploy.app/api/agent/cron";
  const cronSecret = env.CRON_SECRET || "presszero_cron_2026";
  const ghToken = env.GH_PAT_TOKEN;
  const repo = env.GH_REPO || "soumyadeepsarkar-2004/PressZero";

  const results = {
    timestamp: new Date().toISOString(),
    apiPing: null,
    githubDispatch: null,
  };

  // 1. Ping PressZero Next.js serverless cron endpoint
  try {
    const apiRes = await fetch(`${targetUrl}?secret=${cronSecret}&notify=false`, {
      method: "GET",
      headers: {
        "User-Agent": "PressZero-Cloudflare-247-Worker/1.0",
        "x-cron-secret": cronSecret,
      },
    });
    results.apiPing = {
      status: apiRes.status,
      ok: apiRes.ok,
    };
  } catch (err) {
    results.apiPing = { error: err.message };
  }

  // 2. Optional: Dispatch GitHub Actions workflow if GH_PAT_TOKEN is provided
  if (ghToken) {
    try {
      const ghRes = await fetch(
        `https://api.github.com/repos/${repo}/dispatches`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${ghToken}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "PressZero-Cloudflare-Dispatcher",
          },
          body: JSON.stringify({
            event_type: "trigger-agent",
            client_payload: { source: "cloudflare_cron" },
          }),
        }
      );
      results.githubDispatch = {
        status: ghRes.status,
        ok: ghRes.ok,
      };
    } catch (err) {
      results.githubDispatch = { error: err.message };
    }
  }

  return results;
}
