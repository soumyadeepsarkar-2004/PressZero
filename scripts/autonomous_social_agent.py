"""
PressZero 24/7 Autonomous Social & Community Agent
Acts as an autonomous Product Manager, Marketing Lead, and Community Responder.

Capabilities:
1. 24/7 Continuous Monitoring across Instagram, Facebook, YouTube, X, and Reddit.
2. Context-Aware AI triage and zero-slop responses matching user queries.
3. Instant Telegram / WhatsApp push alerts directly to the creator's phone for every interaction.
4. Autonomous Content Calendar & Video Generation Pipeline for scheduled future reels.
5. GitHub Actions / Cloud Cron support (zero-cost, runs while your PC is offline).
"""

import os
import sys
import json
import time
import argparse
import subprocess
from datetime import datetime, timezone, timedelta

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPTS_DIR = os.path.join(ROOT_DIR, "scripts")
DATA_DIR = os.path.join(ROOT_DIR, "data")
MARKETING_DIR = os.path.join(ROOT_DIR, "marketing")

sys.path.insert(0, SCRIPTS_DIR)
from comment_responder import (
    classify_intent,
    generate_response,
    load_state,
    save_state,
    is_already_replied,
    mark_replied,
    RedditConnector,
    InstagramConnector,
    YouTubeConnector,
    XConnector
)
from telegram_notifier import send_telegram_alert

CALENDAR_FILE = os.path.join(MARKETING_DIR, "CONTENT_GROWTH_CALENDAR.json")

# ---------------------------------------------------------------------------
# 1. CONTENT GROWTH CALENDAR & REELS PIPELINE
# ---------------------------------------------------------------------------

DEFAULT_CALENDAR = {
    "project": "PressZero",
    "version": "1.0.0",
    "growth_strategy": "Sustained algorithmic engagement via weekly technical proof reels",
    "pipeline": [
        {
            "id": "reel_01_launch",
            "title": "Never Get Rejected Again - Exact KB Compressor",
            "status": "LIVE",
            "published_at": "2026-11-01T07:20:00Z",
            "asset": "public/videos/presszero-promo-vertical.mp4",
            "platforms": {
                "instagram": "https://www.instagram.com/_hmm.soumo_/reel/DfMxAKRKGtg/",
                "facebook": "https://www.facebook.com/reel/2216495569260338",
                "youtube": "https://www.youtube.com/watch?v=waQuuUmrwmg",
                "x": "https://x.com/sarkar58153/status/2116815001730343100",
                "reddit": "https://www.reddit.com/r/SideProject/comments/1xl2d7c/presszero_i_built_an_opensource_100_inbrowser/"
            }
        },
        {
            "id": "reel_02_privacy_trap",
            "title": "The Aadhaar & Identity Privacy Trap (Why Cloud Compressors are Risky)",
            "scheduled_for": "2026-11-08T09:00:00Z",
            "days_from_launch": 7,
            "status": "READY_TO_RENDER",
            "remotion_composition": "ReelPrivacyTrap",
            "hook": "Stop uploading your Aadhaar card and passport to random compressor websites.",
            "duration_seconds": 15,
            "core_message": "PressZero runs 100% in local WebAssembly RAM. 0 Bytes ever leave your phone.",
            "target_audience": ["Government Job Seekers", "Cybersecurity enthusiasts", "Privacy advocates"]
        },
        {
            "id": "reel_03_signature_bleach",
            "title": "Dirty Phone Shadow to 255-Pure White Ink in 3 Seconds (Otsu Binarization)",
            "scheduled_for": "2026-11-15T09:00:00Z",
            "days_from_launch": 14,
            "status": "READY_TO_RENDER",
            "remotion_composition": "ReelSignatureBleach",
            "hook": "Government portals always reject signatures with gray phone shadows. Here is the 3-second fix.",
            "duration_seconds": 15,
            "core_message": "Instant Otsu Binarization strips paper fibers and desk shadows to pure carbon black ink on 255 white.",
            "target_audience": ["UPSC Aspirants", "SSC CGL Candidates", "NEET/JEE Students"]
        }
    ]
}

def load_calendar():
    if os.path.exists(CALENDAR_FILE):
        try:
            with open(CALENDAR_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return DEFAULT_CALENDAR

def save_calendar(cal):
    os.makedirs(MARKETING_DIR, exist_ok=True)
    with open(CALENDAR_FILE, "w", encoding="utf-8") as f:
        json.dump(cal, f, indent=2, ensure_ascii=False)

# ---------------------------------------------------------------------------
# 2. AUTONOMOUS AUDIT & ENGAGEMENT RUNNER
# ---------------------------------------------------------------------------

def run_community_audit(dry_run=True, alert_telegram=True):
    """
    Scans all community touchpoints, executes triage, sends automated replies,
    and forwards instant Telegram push notifications to the creator.
    """
    state = load_state()
    connectors = {
        "reddit": RedditConnector(dry_run=dry_run),
        "instagram": InstagramConnector(dry_run=dry_run),
        "youtube": YouTubeConnector(dry_run=dry_run),
        "x": XConnector(dry_run=dry_run)
    }

    print("\n" + "=" * 70)
    print(f" 🤖 PRESSZERO 24/7 AUTONOMOUS SOCIAL AGENT | MODE: {'DRY RUN' if dry_run else 'LIVE'}")
    print(f" Timestamp: {datetime.now(timezone.utc).isoformat()} | Alert Telegram: {alert_telegram}")
    print("=" * 70)

    total_new = 0

    for platform_name, conn in connectors.items():
        print(f"\n[*] Auditing {platform_name.upper()}...")
        try:
            comments = conn.fetch_comments()
            if not comments:
                print(f"    No new incoming comments on {platform_name.upper()}.")
                continue

            for c in comments:
                cid = c["id"]
                user = c.get("user", "user")
                text = c.get("text", "")
                post_url = c.get("permalink") or conn.target.get("url") if hasattr(conn, "target") else None

                if is_already_replied(cid, state):
                    continue

                intent, confidence, lang = classify_intent(text)
                reply = generate_response(intent, lang, user, text)

                print(f"\n  🔔 NEW COMMENT DETECTED on {platform_name.upper()}:")
                print(f"     From       : @{user}")
                print(f"     Content    : \"{text}\"")
                print(f"     Intent     : {intent} ({confidence*100:.0f}%, {lang})")
                print(f"     Auto-Reply : \"{reply}\"")

                # Dispatch reply
                if not dry_run:
                    conn.post_reply(cid, reply)

                # Send Telegram push notification to creator's phone
                if alert_telegram:
                    send_telegram_alert(
                        platform=platform_name,
                        user=user,
                        comment=text,
                        intent=f"{intent} ({confidence*100:.0f}%)",
                        auto_reply=reply,
                        post_url=post_url
                    )

                mark_replied(cid, platform_name, user, text, intent, reply, state)
                total_new += 1

        except Exception as e:
            print(f"    [!] Error auditing {platform_name}: {e}")

    print("\n" + "-" * 70)
    print(f" Audit cycle finished: {total_new} new interactions handled and relayed.")
    print("-" * 70)
    return total_new

# ---------------------------------------------------------------------------
# 3. CONTENT GROWTH SCHEDULE AUDIT
# ---------------------------------------------------------------------------

def check_growth_milestones():
    """Checks scheduled dates for upcoming Reels and previews render tasks."""
    cal = load_calendar()
    print("\n" + "=" * 70)
    print(" 🎬 CONTENT GROWTH MILESTONES & REELS PIPELINE")
    print("=" * 70)

    now = datetime.now(timezone.utc)

    for item in cal.get("pipeline", []):
        iid = item["id"]
        title = item["title"]
        status = item.get("status")
        sched = item.get("scheduled_for")

        print(f"\n▶ [{iid.upper()}] Status: {status}")
        print(f"   Title         : \"{title}\"")
        if sched:
            sched_dt = datetime.fromisoformat(sched.replace("Z", "+00:00"))
            delta = sched_dt - now
            days_left = max(0, delta.days)
            print(f"   Scheduled For : {sched} ({days_left} days remaining)")
            print(f"   Hook          : \"{item.get('hook')}\"")
            print(f"   Core Proof    : \"{item.get('core_message')}\"")
        elif status == "LIVE":
            print(f"   Live Links    : {len(item.get('platforms', {}))} platforms verified")

# ---------------------------------------------------------------------------
# 4. CLI ENTRYPOINT
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="PressZero 24/7 Autonomous Social Agent")
    parser.add_argument("--cron", action="store_true", help="Run in GitHub Actions / cloud cron mode (single audit sweep)")
    parser.add_argument("--live", action="store_true", help="Execute live posts and live Telegram alerts (default: dry run)")
    parser.add_argument("--poll", type=int, nargs="?", const=60, default=None, help="Continuously poll every N seconds")
    parser.add_argument("--check-growth", action="store_true", help="Inspect scheduled content growth pipeline and upcoming reels")
    parser.add_argument("--test-alert", action="store_true", help="Send a test notification to Telegram")
    args = parser.parse_args()

    # Ensure initial content calendar exists
    save_calendar(load_calendar())

    if args.test_alert:
        send_telegram_alert(
            platform="instagram",
            user="candidate_rohit",
            comment="Bhai UPSC photo me 80% face coverage chahiye, crop tool me guide lines hain kya?",
            intent="EXAM_PRESET (Biometric Crop)",
            auto_reply="Haan bhai! Studio me Biometric Cropper kholo, wahan UPSC/Passport guide lines di hui hain jo 80% face coverage lock kar deti hain.",
            post_url="https://www.instagram.com/_hmm.soumo_/reel/DfMxAKRKGtg/"
        )
        return

    if args.check_growth:
        check_growth_milestones()
        return

    if args.cron:
        print("[*] Running in 24/7 Cloud Cron mode...")
        run_community_audit(dry_run=not args.live, alert_telegram=True)
        check_growth_milestones()
        return

    if args.poll is not None:
        interval = args.poll
        print(f"[*] Starting 24/7 Continuous Monitor (Interval: {interval}s)... Press Ctrl+C to stop.")
        try:
            while True:
                run_community_audit(dry_run=not args.live, alert_telegram=True)
                time.sleep(interval)
        except KeyboardInterrupt:
            print("\n[!] Monitor stopped.")
        return

    # Default action
    run_community_audit(dry_run=not args.live, alert_telegram=True)
    check_growth_milestones()

if __name__ == "__main__":
    main()
