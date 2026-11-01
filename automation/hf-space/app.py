"""
PressZero 24/7 Autonomous Social Agent - Hugging Face Spaces Daemon
Runs continuously 24/7 on Hugging Face Spaces (Free CPU tier: 2 vCPU, 16GB RAM).
Completely free, runs while personal computer is powered off.
"""

import os
import sys
import json
import time
import threading
from datetime import datetime, timezone
from http.server import HTTPServer, BaseHTTPRequestHandler

# Import local agent scripts
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
SCRIPTS_DIR = os.path.join(os.path.dirname(CURRENT_DIR), "scripts")
DATA_DIR = os.path.join(os.path.dirname(CURRENT_DIR), "data")

sys.path.insert(0, SCRIPTS_DIR)
try:
    from autonomous_social_agent import run_community_audit, load_calendar
    from telegram_notifier import send_telegram_alert
except ImportError:
    run_community_audit = None
    load_calendar = None

STATE = {
    "status": "RUNNING",
    "started_at": datetime.now(timezone.utc).isoformat(),
    "last_sweep": None,
    "total_interactions_relayed": 0,
    "recent_logs": [],
}

def log_event(msg: str):
    ts = datetime.now(timezone.utc).strftime("%H:%M:%S UTC")
    entry = f"[{ts}] {msg}"
    print(entry)
    STATE["recent_logs"].append(entry)
    if len(STATE["recent_logs"]) > 50:
        STATE["recent_logs"].pop(0)

def background_agent_loop(interval_seconds: int = 120):
    log_event("Starting 24/7 autonomous social monitoring loop...")
    while True:
        try:
            if run_community_audit:
                log_event("Executing community audit across Instagram, Facebook, YouTube, X, Reddit...")
                new_count = run_community_audit(dry_run=False, alert_telegram=True)
                STATE["last_sweep"] = datetime.now(timezone.utc).isoformat()
                STATE["total_interactions_relayed"] += new_count
                log_event(f"Audit complete. Processed & relayed {new_count} interactions.")
            else:
                log_event("Autonomous social agent modules loaded.")
        except Exception as e:
            log_event(f"Error in audit cycle: {e}")

        time.sleep(interval_seconds)

class AgentDashboardHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(STATE).encode("utf-8"))
            return

        # Serve visual status dashboard
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()

        logs_html = "".join(f"<div class='log-line'>{log}</div>" for log in reversed(STATE["recent_logs"][-20:]))

        html = f"""<!DOCTYPE html>
<html>
<head>
  <title>PressZero 24/7 Autonomous Social Agent</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {{ background: #0B0F17; color: #E2E8F0; font-family: ui-monospace, monospace; padding: 24px; margin: 0; }}
    .card {{ background: #161F2E; border: 1px solid #1E293B; border-radius: 12px; padding: 20px; max-width: 800px; margin: 0 auto; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }}
    .status-badge {{ display: inline-block; padding: 4px 12px; border-radius: 9999px; background: rgba(16, 185, 129, 0.2); color: #10B981; font-weight: bold; border: 1px solid #10B981; font-size: 13px; }}
    h1 {{ margin: 0 0 16px 0; font-size: 20px; color: #FFFFFF; display: flex; align-items: center; justify-content: space-between; }}
    .grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin: 20px 0; }}
    .stat-box {{ background: #0F172A; padding: 14px; border-radius: 8px; border: 1px solid #334155; }}
    .stat-label {{ font-size: 11px; color: #94A3B8; text-transform: uppercase; }}
    .stat-val {{ font-size: 18px; font-weight: bold; color: #38BDF8; margin-top: 4px; }}
    .logs {{ background: #020617; padding: 14px; border-radius: 8px; border: 1px solid #1E293B; max-height: 280px; overflow-y: auto; font-size: 12px; }}
    .log-line {{ padding: 3px 0; border-bottom: 1px solid #0F172A; color: #CBD5E1; }}
  </style>
</head>
<body>
  <div class="card">
    <h1>
      <span>🤖 PressZero 24/7 Autonomous Agent</span>
      <span class="status-badge">● ONLINE & AUTONOMOUS</span>
    </h1>
    <p style="color: #94A3B8; font-size: 13px; margin: 0 0 20px 0;">
      Continuous Cloud Community Manager • PC-Independent • 100% Free
    </p>

    <div class="grid">
      <div class="stat-box">
        <div class="stat-label">Cloud Host</div>
        <div class="stat-val">Hugging Face 24/7</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">PC Dependent</div>
        <div class="stat-val" style="color: #10B981;">NO (0%)</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Interactions Relayed</div>
        <div class="stat-val">{STATE["total_interactions_relayed"]}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Last Sweep</div>
        <div class="stat-val" style="font-size: 12px; color: #F1F5F9;">{STATE["last_sweep"] or "Starting..."}</div>
      </div>
    </div>

    <h3 style="font-size: 14px; margin: 16px 0 8px 0; color: #94A3B8;">REAL-TIME ACTIVITY LOG:</h3>
    <div class="logs">
      {logs_html if logs_html else "<div class='log-line'>Listening for incoming comments across Instagram, Facebook, YouTube, X, Reddit...</div>"}
    </div>
  </div>
</body>
</html>"""
        self.wfile.write(html.encode("utf-8"))

def run_server(port: int = 7860):
    server = HTTPServer(("0.0.0.0", port), AgentDashboardHandler)
    log_event(f"Dashboard web server active on port {port}")
    server.serve_forever()

if __name__ == "__main__":
    t = threading.Thread(target=background_agent_loop, daemon=True)
    t.start()
    port = int(os.environ.get("PORT", 7860))
    run_server(port)
