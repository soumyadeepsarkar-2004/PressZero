"""
PressZero YouTube Video Automation Uploader
Uploads videos directly to YouTube using YouTube Data API v3 with:
- Resumable file upload
- Custom high-CTR thumbnail attachment
- Chapter timestamps & SEO description
- High-ranking tags
- Privacy status toggle (public, unlisted, private)
"""

import os
import sys
import argparse
import http.client
import httplib2
import random
import time

try:
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError
    from googleapiclient.http import MediaFileUpload
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.oauth2.credentials import Credentials
    from google.auth.transport.requests import Request
except ImportError:
    print("[!] Missing dependencies. Install with: pip install google-api-python-client google-auth-oauthlib google-auth-httplib2")
    sys.exit(1)

SCOPES = ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube"]
API_SERVICE_NAME = "youtube"
API_VERSION = "v3"
CLIENT_SECRETS_FILE = os.path.join(os.path.dirname(__file__), "client_secret.json")
TOKEN_FILE = os.path.join(os.path.dirname(__file__), "youtube_token.json")

# Default metadata calibrated from Claude YouTube Skill
DEFAULT_TITLE = "Never Get Rejected Again! Crush Images to Exact KB (0 Server Uploads)"
DEFAULT_DESCRIPTION = """Tired of government portals rejecting your photos and signatures because they're 51 KB instead of 50 KB?
Try PressZero: https://presszero.antideploy.app (100% Free & Open Source)

PressZero is a zero-knowledge image reducer that runs completely client-side in your browser. Not a single byte ever leaves your device.

TIMESTAMPS:
0:00 - The Portal Rejection Bottleneck (UPSC, SSC, US Visa, Schengen)
0:06 - The Privacy Trap of Cloud Compressors (Aadhaar & PAN risks)
0:14 - Exact Target-KB Bisection Engine (4,850 KB -> 49.8 KB in 64ms)
0:25 - Instant AI Signature Bleach (Otsu Binarization for 255-White)
0:34 - Biometric Passport & Visa Cropper (35x45mm & 2x2in Guides)
0:43 - Zero-Knowledge Architecture (0 Bytes Egress, Offline PWA)
0:51 - How to Use & Open Source Repository

KEY FEATURES:
- Exact Target-KB Guarantee: Type 50 KB, get exactly 49.8 KB with maximum sharpness.
- AI Signature Bleach: Turns messy desk shadows into pure 255/255 white paper.
- Biometric Smart Cropping: Preset templates for US Visa (DS-160), Schengen, Passport Seva.
- 0 Bytes Egress: Everything runs on your CPU via WebAssembly & Web Workers.
- Progressive Web App: Install on Windows, Mac, Android, and iOS for offline use.

LINKS:
Web App: https://presszero.antideploy.app
GitHub: https://github.com/soumyadeepsarkar-2004/PressZero
Developer Documentation: https://presszero.antideploy.app/docs

#ImageCompressor #Privacy #WebDev #OpenSource #Tech #GovExam #PassportPhoto #Shorts
"""

DEFAULT_TAGS = [
    "image compressor", "compress image to 50kb", "exact kb compressor", 
    "upsc photo signature resize", "ssc photo compressor", "us visa photo size", 
    "schengen visa photo 35x45", "passport photo cropper", "remove signature background", 
    "white background signature", "client side compression", "zero knowledge", 
    "privacy tools", "nextjs", "pwa", "webassembly", "presszero"
]

def get_authenticated_service():
    """Authenticates using OAuth 2.0 flow."""
    creds = None
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(CLIENT_SECRETS_FILE):
                print(f"[!] {CLIENT_SECRETS_FILE} not found.")
                print("[i] To enable automated YouTube publishing:")
                print("    1. Go to Google Cloud Console (https://console.cloud.google.com)")
                print("    2. Enable 'YouTube Data API v3'")
                print("    3. Create OAuth 2.0 Client ID (Desktop Application)")
                print(f"    4. Download JSON and save as: {CLIENT_SECRETS_FILE}")
                sys.exit(1)
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRETS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(TOKEN_FILE, "w") as token:
            token.write(creds.to_json())
    return build(API_SERVICE_NAME, API_VERSION, credentials=creds)

def upload_video(youtube, video_path, title, description, tags, category_id="28", privacy_status="public", thumbnail_path=None):
    """Executes resumable video upload and attaches thumbnail."""
    print(f"[*] Initiating upload for: {video_path}")
    print(f"[*] Title: {title}")
    print(f"[*] Privacy: {privacy_status}")

    body = {
        "snippet": {
            "title": title,
            "description": description,
            "tags": tags,
            "categoryId": category_id
        },
        "status": {
            "privacyStatus": privacy_status,
            "selfDeclaredMadeForKids": False
        }
    }

    media = MediaFileUpload(video_path, chunksize=1024*1024*4, resumable=True)
    request = youtube.videos().insert(part=",".join(body.keys()), body=body, media_body=media)

    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            progress = int(status.progress() * 100)
            print(f"[+] Uploading... {progress}%")

    video_id = response.get("id")
    print(f"[✓] Video uploaded successfully! Video ID: {video_id}")
    print(f"[✓] Watch URL: https://youtu.be/{video_id}")

    if thumbnail_path and os.path.exists(thumbnail_path):
        print(f"[*] Setting custom thumbnail: {thumbnail_path}")
        try:
            youtube.thumbnails().set(videoId=video_id, media_body=MediaFileUpload(thumbnail_path)).execute()
            print("[✓] Custom thumbnail attached!")
        except Exception as e:
            print(f"[!] Failed to attach thumbnail: {e}")

    return video_id

def main():
    parser = argparse.ArgumentParser(description="Upload video to YouTube with SEO metadata")
    parser.add_argument("--video", default="public/videos/presszero-youtube-explainer.mp4", help="Path to video file")
    parser.add_argument("--thumbnail", default="public/marketing/youtube-thumbnail-master.jpg", help="Path to thumbnail image")
    parser.add_argument("--title", default=DEFAULT_TITLE, help="Video title")
    parser.add_argument("--privacy", default="public", choices=["public", "private", "unlisted"], help="Privacy status")
    args = parser.parse_args()

    if not os.path.exists(args.video):
        print(f"[!] Error: Video file {args.video} does not exist.")
        sys.exit(1)

    youtube = get_authenticated_service()
    upload_video(
        youtube=youtube,
        video_path=args.video,
        title=args.title,
        description=DEFAULT_DESCRIPTION,
        tags=DEFAULT_TAGS,
        category_id="28", # Science & Technology
        privacy_status=args.privacy,
        thumbnail_path=args.thumbnail
    )

if __name__ == "__main__":
    main()
