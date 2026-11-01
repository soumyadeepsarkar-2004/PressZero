"""
PressZero Telegram Notification Relay
Delivers instant, zero-cost real-time alerts to the creator's phone whenever a user
interacts, comments, asks a question, or gives feedback across any platform.

100% Free Forever via Telegram Bot API (No Twilio/WhatsApp business fees required).
"""

import os
import sys
import json
import requests
from datetime import datetime, timezone

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_FILE = os.path.join(ROOT_DIR, ".env")

def get_telegram_creds():
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")
    
    # Try reading from .env if not in environment
    if not token or not chat_id:
        if os.path.exists(ENV_FILE):
            with open(ENV_FILE, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line.startswith("TELEGRAM_BOT_TOKEN="):
                        token = line.split("=", 1)[1].strip().strip('"').strip("'")
                    elif line.startswith("TELEGRAM_CHAT_ID="):
                        chat_id = line.split("=", 1)[1].strip().strip('"').strip("'")
    return token, chat_id

def send_telegram_alert(platform: str, user: str, comment: str, intent: str, auto_reply: str, post_url: str = None) -> bool:
    """
    Sends a beautifully structured Markdown alert to the creator's Telegram.
    """
    token, chat_id = get_telegram_creds()
    now_str = datetime.now(timezone.utc).strftime("%d %b %Y, %H:%M UTC")

    # Platform Icon Mapping
    icons = {
        "instagram": "📸 Instagram Reel",
        "facebook": "📘 Facebook Video",
        "reddit": "🤖 Reddit (r/SideProject)",
        "youtube": "▶️ YouTube Video",
        "x": "🐦 X (Twitter)",
        "website": "🌐 PressZero Web App"
    }
    plat_str = icons.get(platform.lower(), f"🌐 {platform.capitalize()}")

    # Use HTML formatting for rock-solid parsing without escape issues
    import html
    safe_comment = html.escape(comment)
    safe_reply = html.escape(auto_reply)
    safe_user = html.escape(user)

    message_html = (
        f"🚨 <b>PressZero Community Alert</b>\n\n"
        f"📍 <b>Platform:</b> {plat_str}\n"
        f"👤 <b>Author:</b> @{safe_user}\n"
        f"💬 <b>Comment:</b>\n<i>\"{safe_comment}\"</i>\n\n"
        f"🧠 <b>Triage Intent:</b> <code>{intent}</code>\n"
        f"⚡ <b>Auto-Reply Dispatched:</b>\n<i>\"{safe_reply}\"</i>\n\n"
        f"🕒 <b>Timestamp:</b> {now_str}\n"
    )

    if post_url:
        message_html += f"🔗 <a href=\"{post_url}\">View Live Thread</a>"

    if not token or not chat_id:
        print(f"[Telegram Notifier] [SIMULATED] (Set TELEGRAM_BOT_TOKEN & TELEGRAM_CHAT_ID to receive on phone):\n{message_html}")
        return True

    api_url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": message_html,
        "parse_mode": "HTML",
        "link_preview_options": {"is_disabled": False}
    }

    try:
        resp = requests.post(api_url, json=payload, timeout=10)
        if resp.status_code == 200:
            print(f"[✓] Telegram alert successfully sent to chat {chat_id}")
            return True
        else:
            print(f"[!] Telegram API error {resp.status_code}: {resp.text}")
            return False
    except Exception as e:
        print(f"[!] Failed to deliver Telegram alert: {e}")
        return False

def test_alert():
    print("=" * 60)
    print(" SENDING TEST TELEGRAM ALERT...")
    print("=" * 60)
    success = send_telegram_alert(
        platform="instagram",
        user="test_aspirant_2026",
        comment="UPSC signature 20kb se kam chahiye aur background white nahi ho raha, kaise karu?",
        intent="EXAM_PRESET (UPSC)",
        auto_reply="UPSC ke liye signature 10-20 KB aur photo 20-50 KB chahiye hoti hai. PressZero Studio me 'UPSC' preset select karo ya target me '18 KB' likh do, exact lock kar dega!",
        post_url="https://www.instagram.com/_hmm.soumo_/reel/DfMxAKRKGtg/"
    )
    if success:
        print("[✓] Notification dispatch test completed.")

if __name__ == "__main__":
    test_alert()
