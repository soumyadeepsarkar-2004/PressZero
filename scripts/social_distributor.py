"""
PressZero Multi-Platform Social Media Distribution Engine
Validates rendered video assets, packages platform-specific payloads, and outputs
publishing scripts for YouTube, Instagram, X (Twitter), Facebook, and Reddit.
"""

import os
import sys
import json
import argparse
from datetime import datetime

# Set UTF-8 encoding for standard output on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VIDEOS_DIR = os.path.join(ROOT_DIR, "public", "videos")
MARKETING_DIR = os.path.join(ROOT_DIR, "public", "marketing")

ASSETS = {
    "youtube_long": os.path.join(VIDEOS_DIR, "presszero-youtube-explainer.mp4"),
    "reels_shorts_vertical": os.path.join(VIDEOS_DIR, "presszero-promo-vertical.mp4"),
    "preview_gif": os.path.join(VIDEOS_DIR, "presszero-promo.gif"),
    "yt_thumbnail": os.path.join(MARKETING_DIR, "youtube-thumbnail-master.jpg"),
    "ig_square_promo": os.path.join(MARKETING_DIR, "instagram-promo-square.jpg")
}

PLATFORM_PACKAGES = {
    "youtube_long": {
        "title": "Never Get Rejected Again! Crush Images to Exact KB (0 Server Uploads)",
        "asset": ASSETS["youtube_long"],
        "thumbnail": ASSETS["yt_thumbnail"],
        "chapters": [
            "0:00 The Portal Rejection Bottleneck",
            "0:06 The Privacy Trap of Cloud Compressors",
            "0:14 Exact Target-KB Bisection Engine",
            "0:25 Instant AI Signature Bleach",
            "0:34 Biometric Passport & Visa Cropper",
            "0:43 Zero-Knowledge Architecture",
            "0:51 Outro & How to Try Free"
        ]
    },
    "youtube_shorts_and_reels": {
        "hook": "Stop guessing image compression sliders for government portals.",
        "asset": ASSETS["reels_shorts_vertical"],
        "caption": """Stop guessing image compression sliders. 🙅‍♂️

If you've ever applied for UPSC, SSC, US Visa, Schengen, or Passport Seva, you know the pain:
❌ "File exceeds 50 KB"
❌ "Background must be pure white"
❌ "Aspect ratio rejected"

Generic cloud compressors make you slide vague percentages and upload your private Aadhaar/PAN to remote servers.

PressZero fixes this completely:
⚡ Type 50 KB → hits 49.8 KB on the dot in 64ms
📄 AI Signature Bleach → 100% pure 255-white background
📐 Biometric Reticle → Built-in passport & visa aspect ratios
🛡️ 0 Bytes Egress → 100% client-side WebAssembly (no servers, no data leaks)

Try it 100% free right now:
👉 https://presszero.antideploy.app
⭐ Star on GitHub: github.com/soumyadeepsarkar-2004/PressZero

#TechHacks #GovExams #UPSC #SSC #WebDev #OpenSource #ImageCompressor #Reels #Shorts #TechTips""",
        "tags": ["#TechHacks", "#GovExams", "#UPSC", "#SSC", "#ImageCompressor", "#Privacy", "#OpenSource"]
    },
    "x_twitter_thread": [
        "1/7 🚨 Every month, millions of job & visa applicants get rejected by government portals (UPSC, SSC, US Visa, Schengen) because their photo is 51 KB instead of 50 KB.\n\nWe built PressZero to solve this forever — with 0 server uploads.\n\nHere is how it works: 👇",
        "2/7 The Problem with Online Compressors:\n\nWhen you use tools like TinyPNG or random resizing websites:\n1. Your sensitive Aadhaar, PAN, and passport are uploaded to remote cloud servers.\n2. You get vague 'quality' sliders. Guess 80%? 74 KB. Guess 60%? Blurry mess.",
        "3/7 The PressZero Bisection Engine:\n\nInstead of guessing, PressZero runs a binary search on the image's quantization matrix right in your browser via Web Workers.\n\nYou set the target to 50 KB. The engine dynamically brackets the file and hits 49.8 KB in < 80ms.",
        "4/7 AI Signature & Stamp Bleaching:\n\nTaking a phone photo of your signature always results in yellow paper and desk shadows. Portals reject this.\n\nOur adaptive Otsu thresholding bleaches the background to 100% pure RGB(255, 255, 255) without thinning ink strokes.",
        "5/7 Biometric Smart Cropping:\n\nNo more manual pixel math. We built one-click presets for:\n- US Visa (2x2 in, 600x600)\n- Schengen Visa (35x45 mm)\n- UPSC / SSC Exam (3.5x4.5 cm)\n\nWith biometric eye and chin guidelines.",
        "6/7 Zero-Knowledge Guarantee:\n\n🛡️ 0 Bytes Egress\n⚡ Works 100% Offline (PWA)\n🔓 MIT Licensed & Fully Open Source\n\nYour biometric data never touches any server.",
        "7/7 Try PressZero right now (no signup, 100% free forever):\n\n🌐 Web App: https://presszero.antideploy.app\n⭐ GitHub: https://github.com/soumyadeepsarkar-2004/PressZero\n\nRT to save a job applicant from portal rejection hell! 🔁"
    ]
}

def verify_assets():
    print("=" * 60)
    print(" PRESSZERO SOCIAL MEDIA ASSETS VERIFICATION")
    print("=" * 60)
    all_ok = True
    for name, path in ASSETS.items():
        exists = os.path.exists(path)
        size_str = f"{os.path.getsize(path) / 1024 / 1024:.2f} MB" if exists else "NOT FOUND"
        status = "✓ READY" if exists else "✗ PENDING/MISSING"
        print(f"[{status}] {name:<25}: {size_str:<10} ({os.path.basename(path)})")
        if not exists:
            all_ok = False
    print("=" * 60)
    return all_ok

def export_packages():
    out_path = os.path.join(ROOT_DIR, "marketing", "DISTRIBUTION_PAYLOAD.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(PLATFORM_PACKAGES, f, indent=2, ensure_ascii=False)
    print(f"[✓] Social distribution payloads exported to: {out_path}")

def main():
    parser = argparse.ArgumentParser(description="PressZero Social Media Distribution Engine")
    parser.add_argument("--check", action="store_true", help="Check asset status")
    parser.add_argument("--export", action="store_true", help="Export distribution payloads")
    args = parser.parse_args()

    verify_assets()
    export_packages()

if __name__ == "__main__":
    main()
