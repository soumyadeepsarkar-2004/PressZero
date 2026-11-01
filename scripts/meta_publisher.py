"""
PressZero Meta Publisher (Instagram & Facebook Automation Engine)
Publishes Reels, Carousel Photos, and Videos to Instagram and Facebook using:
- Meta Graph API (Official Graph API v21.0)
- Dry-run simulation and payload verification
"""

import os
import sys
import json
import time
import argparse
import requests

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VIDEO_VERTICAL = os.path.join(ROOT_DIR, "public", "videos", "presszero-promo-vertical.mp4")
VIDEO_LANDSCAPE = os.path.join(ROOT_DIR, "public", "videos", "presszero-youtube-explainer.mp4")
IMAGE_SQUARE = os.path.join(ROOT_DIR, "public", "marketing", "instagram-promo-square.jpg")
CAPTION_FILE = os.path.join(ROOT_DIR, "marketing", "INSTAGRAM_REEL_POST_READY.txt")

# Public CDN endpoints on Antideploy for Graph API ingest
PUBLIC_VIDEO_URL = "https://presszero.antideploy.app/videos/presszero-promo-vertical.mp4"
PUBLIC_IMAGE_URL = "https://presszero.antideploy.app/marketing/instagram-promo-square.jpg"

def load_caption():
    if os.path.exists(CAPTION_FILE):
        with open(CAPTION_FILE, "r", encoding="utf-8") as f:
            return f.read().strip()
    return "Stop guessing image compression sliders for government portals. PressZero crushes images to exact KB with 0 server uploads."

def publish_instagram_reel(access_token, ig_user_id, video_url=PUBLIC_VIDEO_URL, caption=None):
    """Publishes a Reel to Instagram via Graph API."""
    if not caption:
        caption = load_caption()

    print("[*] Step 1: Creating Instagram Reel Container...")
    url = f"https://graph.facebook.com/v21.0/{ig_user_id}/media"
    payload = {
        "media_type": "REELS",
        "video_url": video_url,
        "caption": caption,
        "share_to_feed": "true",
        "access_token": access_token
    }

    resp = requests.post(url, data=payload)
    if resp.status_code != 200:
        print(f"[!] Error creating container: {resp.status_code} - {resp.text}")
        return False

    container_id = resp.json().get("id")
    print(f"[✓] Container created successfully! Container ID: {container_id}")

    # Wait for Instagram media processing
    print("[*] Step 2: Waiting for Instagram to process video...")
    for attempt in range(12):
        time.sleep(5)
        status_url = f"https://graph.facebook.com/v21.0/{container_id}?fields=status_code&access_token={access_token}"
        s_resp = requests.get(status_url).json()
        status_code = s_resp.get("status_code")
        print(f"    Processing status: {status_code} ({attempt + 1}/12)")
        if status_code == "FINISHED":
            break
        elif status_code == "ERROR":
            print(f"[!] Processing failed on Instagram: {s_resp}")
            return False

    # Publish
    print("[*] Step 3: Publishing Reel to Instagram Feed...")
    pub_url = f"https://graph.facebook.com/v21.0/{ig_user_id}/media_publish"
    pub_payload = {
        "creation_id": container_id,
        "access_token": access_token
    }
    pub_resp = requests.post(pub_url, data=pub_payload)
    if pub_resp.status_code == 200:
        media_id = pub_resp.json().get("id")
        print(f"[✓] REEL PUBLISHED TO INSTAGRAM! Media ID: {media_id}")
        return True
    else:
        print(f"[!] Publish failed: {pub_resp.status_code} - {pub_resp.text}")
        return False

def publish_facebook_video(access_token, page_id, video_path=VIDEO_VERTICAL, title="Never Get Rejected Again - PressZero", description=None):
    """Publishes a Video to a Facebook Page."""
    if not description:
        description = load_caption()

    print(f"[*] Publishing video to Facebook Page {page_id}...")
    url = f"https://graph-video.facebook.com/v21.0/{page_id}/videos"
    
    with open(video_path, "rb") as video_file:
        files = {"source": video_file}
        data = {
            "title": title,
            "description": description,
            "access_token": access_token
        }
        resp = requests.post(url, files=files, data=data)

    if resp.status_code == 200:
        fb_video_id = resp.json().get("id")
        print(f"[✓] VIDEO PUBLISHED TO FACEBOOK! Video ID: {fb_video_id}")
        return True
    else:
        print(f"[!] Facebook upload failed: {resp.status_code} - {resp.text}")
        return False

def dry_run_preview():
    caption = load_caption()
    print("=" * 65)
    print(" PRESSZERO META PUBLISHER (DRY RUN & ASSET INSPECTOR)")
    print("=" * 65)
    print(f"1. Instagram Reel Asset  : {VIDEO_VERTICAL}")
    print(f"   Size                 : {os.path.getsize(VIDEO_VERTICAL)/1024/1024:.2f} MB")
    print(f"   Public Hosting URL   : {PUBLIC_VIDEO_URL}")
    print(f"2. Feed Graphic Asset   : {IMAGE_SQUARE}")
    print(f"   Size                 : {os.path.getsize(IMAGE_SQUARE)/1024:.1f} KB")
    print(f"   Public Hosting URL   : {PUBLIC_IMAGE_URL}")
    print("-" * 65)
    print("LINTED HUMAN INSTAGRAM CAPTION:")
    print("-" * 65)
    print(caption)
    print("=" * 65)
    print("\n[i] READY TO PUBLISH VIA GRAPH API:")
    print("To publish directly from the command line, provide your Meta access token:")
    print("python scripts/meta_publisher.py --token <ACCESS_TOKEN> --ig-id <IG_USER_ID> --fb-id <PAGE_ID>")
    print("\nOr upload directly to Meta Business Suite / Instagram Mobile App using the files above!")

def main():
    parser = argparse.ArgumentParser(description="Publish PressZero video and posts to Instagram and Facebook")
    parser.add_argument("--token", help="Meta Graph API Access Token")
    parser.add_argument("--ig-id", help="Instagram Professional Account ID")
    parser.add_argument("--fb-id", help="Facebook Page ID")
    parser.add_argument("--dry-run", action="store_true", default=False, help="Preview payload without sending")
    args = parser.parse_args()

    token = args.token or os.environ.get("META_ACCESS_TOKEN")
    ig_id = args.ig_id or os.environ.get("IG_ACCOUNT_ID")
    fb_id = args.fb_id or os.environ.get("FB_PAGE_ID")

    if not token or args.dry_run:
        dry_run_preview()
        return

    if ig_id:
        publish_instagram_reel(token, ig_id)
    if fb_id:
        publish_facebook_video(token, fb_id)

if __name__ == "__main__":
    main()
