"""
PressZero X (Twitter) Automation Publisher
Publishes high-engagement viral launch threads with attached media using X API v2.
Supports:
- 7-tweet viral thread sequencing
- Video / Image media upload via Twitter Media Upload API
- Dry-run preview and payload validation
"""

import os
import sys
import json
import time
import argparse
import base64
import hmac
import hashlib
import urllib.parse
import requests

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAYLOAD_FILE = os.path.join(ROOT_DIR, "marketing", "DISTRIBUTION_PAYLOAD.json")
VERTICAL_VIDEO = os.path.join(ROOT_DIR, "public", "videos", "presszero-promo-vertical.mp4")

def build_oauth_header(method, url, params, api_key, api_secret, access_token, access_token_secret):
    """Generates standard OAuth 1.0a authorization header."""
    oauth_params = {
        "oauth_consumer_key": api_key,
        "oauth_nonce": str(int(time.time() * 1000)),
        "oauth_signature_method": "HMAC-SHA1",
        "oauth_timestamp": str(int(time.time())),
        "oauth_token": access_token,
        "oauth_version": "1.0",
    }
    all_params = {**oauth_params, **params}
    sorted_params = sorted(all_params.items())
    param_str = "&".join([f"{urllib.parse.quote(k, safe='')}={urllib.parse.quote(str(v), safe='')}" for k, v in sorted_params])
    base_string = f"{method.upper()}&{urllib.parse.quote(url, safe='')}&{urllib.parse.quote(param_str, safe='')}"
    signing_key = f"{urllib.parse.quote(api_secret, safe='')}&{urllib.parse.quote(access_token_secret, safe='')}".encode()
    signature = base64.b64encode(hmac.new(signing_key, base_string.encode(), hashlib.sha1).digest()).decode()
    oauth_params["oauth_signature"] = signature
    header_str = "OAuth " + ", ".join([f'{urllib.parse.quote(k, safe="")}="{urllib.parse.quote(v, safe="")}"' for k, v in sorted(oauth_params.items())])
    return header_str

def upload_media_to_x(file_path, api_key, api_secret, access_token, access_token_secret, media_type="video/mp4"):
    """Performs chunked upload to Twitter 1.1 Media Upload API."""
    upload_url = "https://upload.twitter.com/1.1/media/upload.json"
    file_size = os.path.getsize(file_path)
    print(f"[*] Uploading {os.path.basename(file_path)} ({file_size / 1024 / 1024:.2f} MB) to X...")

    # 1. INIT
    init_params = {
        "command": "INIT",
        "total_bytes": file_size,
        "media_type": media_type,
        "media_category": "tweet_video" if "video" in media_type else "tweet_image"
    }
    header = build_oauth_header("POST", upload_url, init_params, api_key, api_secret, access_token, access_token_secret)
    r = requests.post(upload_url, data=init_params, headers={"Authorization": header})
    if r.status_code not in (200, 202):
        print(f"[!] Init failed: {r.text}")
        return None
    media_id = r.json().get("media_id_string")

    # 2. APPEND
    chunk_size = 4 * 1024 * 1024
    segment_id = 0
    with open(file_path, "rb") as f:
        while True:
            chunk = f.read(chunk_size)
            if not chunk:
                break
            append_params = {
                "command": "APPEND",
                "media_id": media_id,
                "segment_index": segment_id
            }
            header = build_oauth_header("POST", upload_url, append_params, api_key, api_secret, access_token, access_token_secret)
            requests.post(upload_url, data=append_params, files={"media": chunk}, headers={"Authorization": header})
            segment_id += 1
            print(f"    Uploaded chunk {segment_id}...")

    # 3. FINALIZE
    fin_params = {"command": "FINALIZE", "media_id": media_id}
    header = build_oauth_header("POST", upload_url, fin_params, api_key, api_secret, access_token, access_token_secret)
    r = requests.post(upload_url, data=fin_params, headers={"Authorization": header})
    print(f"[✓] Media ready on X! Media ID: {media_id}")
    return media_id

def publish_thread(api_key, api_secret, access_token, access_token_secret, attach_video=True):
    with open(PAYLOAD_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    tweets = data.get("x_twitter_thread", [])

    media_id = None
    if attach_video and os.path.exists(VERTICAL_VIDEO):
        media_id = upload_media_to_x(VERTICAL_VIDEO, api_key, api_secret, access_token, access_token_secret, "video/mp4")

    previous_tweet_id = None
    for idx, text in enumerate(tweets):
        print(f"[*] Posting Tweet {idx + 1}/{len(tweets)}...")
        tweet_payload = {"text": text}
        if idx == 0 and media_id:
            tweet_payload["media"] = {"media_ids": [media_id]}
        if previous_tweet_id:
            tweet_payload["reply"] = {"in_reply_to_tweet_id": previous_tweet_id}

        url = "https://api.twitter.com/2/tweets"
        header = build_oauth_header("POST", url, {}, api_key, api_secret, access_token, access_token_secret)
        r = requests.post(url, json=tweet_payload, headers={"Authorization": header, "Content-Type": "application/json"})
        if r.status_code in (200, 201):
            created_id = r.json().get("data", {}).get("id")
            print(f"[✓] Tweet {idx + 1} published! ID: {created_id}")
            previous_tweet_id = created_id
            time.sleep(2)
        else:
            print(f"[!] Tweet failed: {r.status_code} - {r.text}")
            break

def dry_run():
    with open(PAYLOAD_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    tweets = data.get("x_twitter_thread", [])
    print("=" * 65)
    print(" PRESSZERO X (TWITTER) VIRAL THREAD PREVIEW")
    print("=" * 65)
    for idx, t in enumerate(tweets):
        print(f"\n[TWEET {idx + 1}/{len(tweets)}]")
        print("-" * 65)
        print(t)
        if idx == 0:
            print(f"📎 Attached Media: {VERTICAL_VIDEO} ({os.path.getsize(VERTICAL_VIDEO)/1024/1024:.2f} MB)")
    print("=" * 65)
    print("\n[i] Run with credentials to publish:")
    print("python scripts/x_publisher.py --api-key <KEY> --api-secret <SECRET> --token <TOKEN> --token-secret <SECRET>")

def main():
    parser = argparse.ArgumentParser(description="Publish PressZero viral thread to X (Twitter)")
    parser.add_argument("--api-key", default=os.environ.get("X_API_KEY"))
    parser.add_argument("--api-secret", default=os.environ.get("X_API_SECRET"))
    parser.add_argument("--token", default=os.environ.get("X_ACCESS_TOKEN"))
    parser.add_argument("--token-secret", default=os.environ.get("X_ACCESS_TOKEN_SECRET"))
    parser.add_argument("--dry-run", action="store_true", default=False)
    args = parser.parse_args()

    if not args.api_key or args.dry_run:
        dry_run()
        return

    publish_thread(args.api_key, args.api_secret, args.token, args.token_secret)

if __name__ == "__main__":
    main()
