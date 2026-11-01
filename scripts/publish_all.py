"""
PressZero Unified Social Automation Coordinator
One-command orchestrator to publish across:
- Instagram Reels & Posts (Meta Graph API)
- Facebook Videos & Posts (Graph API)
- X / Twitter Viral Threads (X API v2)
- YouTube Long-form & Shorts (YouTube Data API v3)
"""

import os
import sys
import subprocess
import argparse

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPTS_DIR = os.path.join(ROOT_DIR, "scripts")

def run_step(cmd_args, title):
    print("\n" + "=" * 65)
    print(f" ▶ {title}")
    print("=" * 65)
    res = subprocess.run(cmd_args)
    return res.returncode == 0

def main():
    parser = argparse.ArgumentParser(description="Unified multi-platform publisher for PressZero")
    parser.add_argument("--live", action="store_true", default=False, help="Execute live publishing (default is dry-run)")
    parser.add_argument("--platforms", default="all", choices=["all", "meta", "x", "youtube"])
    args = parser.parse_args()

    print("=" * 65)
    print(f" PRESSZERO UNIFIED SOCIAL PUBLISHER (MODE: {'LIVE' if args.live else 'DRY RUN'})")
    print("=" * 65)

    # 1. Verification of assets
    run_step([sys.executable, os.path.join(SCRIPTS_DIR, "social_distributor.py"), "--check", "--export"], "Step 1: Assets & Payload Verification")

    # 2. X (Twitter)
    if args.platforms in ("all", "x"):
        x_cmd = [sys.executable, os.path.join(SCRIPTS_DIR, "x_publisher.py")]
        if not args.live:
            x_cmd.append("--dry-run")
        run_step(x_cmd, "Step 2: X (Twitter) Launch Thread")

    # 3. Meta (Instagram & Facebook)
    if args.platforms in ("all", "meta"):
        meta_cmd = [sys.executable, os.path.join(SCRIPTS_DIR, "meta_publisher.py")]
        if not args.live:
            meta_cmd.append("--dry-run")
        run_step(meta_cmd, "Step 3: Meta (Instagram Reels & Facebook)")

    # 4. YouTube
    if args.platforms in ("all", "youtube"):
        print("\n" + "=" * 65)
        print(" ▶ Step 4: YouTube Data API v3 Uploader")
        print("=" * 65)
        if args.live:
            subprocess.run([sys.executable, os.path.join(SCRIPTS_DIR, "youtube_uploader.py")])
        else:
            print("[DRY RUN] Video Target : public/videos/presszero-youtube-explainer.mp4 (16.9 MB)")
            print("[DRY RUN] Thumbnail    : public/marketing/youtube-thumbnail-master.jpg (788 KB)")
            print("[DRY RUN] Title        : Never Get Rejected Again! Crush Images to Exact KB (0 Server Uploads)")
            print("[i] To execute live YouTube upload: python scripts/youtube_uploader.py")

    print("\n" + "=" * 65)
    print(" [✓] UNIFIED ORCHESTRATION CYCLE COMPLETE")
    print("=" * 65)

if __name__ == "__main__":
    main()
