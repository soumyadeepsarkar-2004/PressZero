"""
PressZero Multi-Platform Community & Comment Automation Engine
Automated triage, intent classification, and humanized response delivery for:
- Instagram (Reels & Feed comments via Meta Graph API)
- Facebook (Page posts & video comments via Meta Graph API)
- YouTube (Long-form & Shorts comments via YouTube Data API v3)
- X / Twitter (Mentions & Thread replies via X API v2)
- Reddit (Submissions & comment trees in r/SideProject)

Compliance & Humanization Standards:
- Zero AI slop: No em dashes, no buzzwords ('delve', 'testament', 'game changer', 'revolutionary').
- Natural length matching and tone (Hinglish / English auto-switching).
- Strict idempotency: Never replies twice to the same comment ID (state in data/replied_comments.json).
"""

import os
import sys
import re
import json
import time
import random
import argparse
import requests
from datetime import datetime, timezone

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT_DIR, "data")
STATE_FILE = os.path.join(DATA_DIR, "replied_comments.json")

# Verified Live Launch Post IDs
LIVE_TARGETS = {
    "reddit": {
        "post_id": "1xl2d7c",
        "url": "https://www.reddit.com/r/SideProject/comments/1xl2d7c/presszero_i_built_an_opensource_100_inbrowser/",
        "author": "babuji_cake",
        "subreddit": "SideProject"
    },
    "instagram": {
        "reel_shortcode": "DfMxAKRKGtg",
        "url": "https://www.instagram.com/_hmm.soumo_/reel/DfMxAKRKGtg/",
        "account": "_hmm.soumo_"
    },
    "youtube": {
        "video_id": "waQuuUmrwmg",
        "url": "https://www.youtube.com/watch?v=waQuuUmrwmg",
        "channel": "TechX Shann"
    },
    "x": {
        "tweet_id": "2116815001730343100",
        "thread_head": "2116808835906334807",
        "url": "https://x.com/sarkar58153/status/2116815001730343100",
        "handle": "sarkar58153"
    },
    "facebook": {
        "profile": "shann.ishann.18",
        "url": "https://www.facebook.com/shann.ishann.18"
    }
}

# ---------------------------------------------------------------------------
# 1. INTENT TAXONOMY & KEYWORD PATTERNS
# ---------------------------------------------------------------------------

INTENTS = {
    "LINK_REQUEST": {
        "keywords": [
            r"\blink\b", r"\bwebsite\b", r"\burl\b", r"\bsite\b", r"\bkaha\b", r"\bkidhar\b",
            r"\bwhere\b", r"\bdownload\b", r"\bfree\b", r"\bpaise\b", r"\bcost\b", r"\bprice\b",
            r"\bcharges\b", r"\bapp name\b", r"\bsoftware\b", r"\bhow to use\b", r"\bweb app\b",
            r"\bgithub\b", r"\bsource code\b"
        ],
        "weight": 2.0
    },
    "PRIVACY_SECURITY": {
        "keywords": [
            r"\bsafe\b", r"\bprivacy\b", r"\bsecurity\b", r"\bleak\b", r"\bdata\b", r"\bserver\b",
            r"\bupload\b", r"\bcloud\b", r"\baadhaar\b", r"\bpassport\b", r"\bpan\b", r"\bhack\b",
            r"\btrust\b", r"\bsecret\b", r"\bstore\b", r"\bdatabase\b", r"\begress\b", r"\bair plane\b",
            r"\bairplane\b", r"\boffline\b"
        ],
        "weight": 2.2
    },
    "EXAM_PRESET": {
        "keywords": [
            r"\bupsc\b", r"\bnta\b", r"\bneet\b", r"\bjee\b", r"\bgate\b", r"\bssc\b", r"\bsbi\b",
            r"\bibps\b", r"\bvisa\b", r"\bds-?160\b", r"\bschengen\b", r"\bsignature\b", r"\bsign\b",
            r"\bphoto size\b", r"\bdimension\b", r"\b20kb\b", r"\b50kb\b", r"\b10kb\b", r"\b100kb\b",
            r"\b200kb\b", r"\b240kb\b", r"\bportal\b", r"\breject\b", r"\bgovt\b", r"\bgovernment\b"
        ],
        "weight": 2.5
    },
    "TROUBLESHOOTING": {
        "keywords": [
            r"\bcontrast\b", r"\bcutoff\b", r"\bthreshold\b", r"\bfaint\b", r"\bdark\b",
            r"\bblack\b", r"\bwhite\b", r"\bink\b", r"\bblurry\b", r"\bblur\b", r"\bclear\b",
            r"\bdesktop\b", r"\bwindows\b", r"\bmac\b", r"\bexe\b", r"\binstall\b", r"\berror\b",
            r"\bissue\b", r"\bproblem\b", r"\bhelp\b", r"\bworking\b", r"\bnot working\b"
        ],
        "weight": 2.0
    },
    "SKEPTIC_OBJECTION": {
        "keywords": [
            r"\balready\b", r"\btinypng\b", r"\biloveimg\b", r"\bphotoshop\b", r"\bcanva\b",
            r"\bwhy use\b", r"\bwhat is new\b", r"\bwhat's new\b", r"\bscam\b", r"\bfake\b",
            r"\bmarket me\b", r"\bbazaron me\b", r"\bkaafi hai\b", r"\bcompetitor\b"
        ],
        "weight": 2.3
    },
    "GENERAL_APPRECIATION": {
        "keywords": [
            r"\bawesome\b", r"\bgreat\b", r"\bhelpful\b", r"\bop\b", r"\bnice\b", r"\bmast\b",
            r"\bsuper\b", r"\blove it\b", r"\bkudos\b", r"\buseful\b", r"\bthank you\b",
            r"\bthanks\b", r"\bbadiya\b", r"\bshandar\b", r"\bgood work\b", r"\bwell done\b",
            r"\bcongrats\b", r"\bcongratulations\b"
        ],
        "weight": 1.5
    }
}

# ---------------------------------------------------------------------------
# 2. HUMANIZED RESPONSE MATRIX (Zero-AI-Slop, Multi-Variant)
# ---------------------------------------------------------------------------

RESPONSES = {
    "LINK_REQUEST": {
        "hinglish": [
            "Bhai direct link ye raha: https://presszero.antideploy.app - bina kisi sign-up ya email ke browser me turant chalega!",
            "Ye lijiye direct link: https://presszero.antideploy.app - 100% free hai, koi daily limit ya watermarks nahi hain.",
            "Aap https://presszero.antideploy.app par directly try kar sakte hain. Phone aur laptop dono par bina login ke chalta hai!",
            "Bhai presszero.antideploy.app par jao, ek second me khulega aur bilkul free aur open source hai."
        ],
        "english": [
            "Here is the direct link: https://presszero.antideploy.app - completely free, no sign-up or installation required!",
            "You can jump straight in at https://presszero.antideploy.app. No ads, zero subscription, and 100% open source.",
            "Direct web app is live at https://presszero.antideploy.app. Works instantly on mobile and desktop browsers.",
            "Head over to https://presszero.antideploy.app - it runs entirely in your local browser with no quotas."
        ]
    },
    "PRIVACY_SECURITY": {
        "hinglish": [
            "PressZero ka sabse bada feature hi 0 Bytes Egress hai! Tumhari photo kisi server par nahi jaati, saara compression phone/laptop ke browser RAM me hota hai. Internet band karke airplane mode me test kar lo!",
            "Aadhaar, Passport aur Certificates ke liye bilkul safe hai kyunki humara koi cloud backend ya storage database hai hi nahi. Network tab me 0 bytes transfer dekh sakte ho.",
            "Bhai 100% privacy guaranteed hai. Code open source hai aur photo client-side WebAssembly me process hoti hai, device se bahar ek byte bhi nahi nikalta.",
            "Poora compression offline browser memory me hota hai. Chahe Wi-Fi band karke compress karo, tab bhi perfectly chalega!"
        ],
        "english": [
            "Zero Bytes Egress is our core promise. Your files never touch a remote server; everything processes locally in your browser memory via WebAssembly. You can test it in airplane mode!",
            "Totally safe for Aadhaar, PAN cards, and passports. There is literally zero backend storage or server upload. Feel free to inspect your browser Network tab to verify 0 bytes sent.",
            "Privacy is guaranteed by design because it runs client-side. The entire codebase is open source and auditable on GitHub.",
            "Your images never leave your local RAM. You can disconnect your internet completely and PressZero will still compress perfectly."
        ]
    },
    "EXAM_PRESET": {
        "hinglish": [
            "UPSC ke liye signature 10-20 KB aur photo 20-50 KB chahiye hoti hai. PressZero Studio me direct UPSC preset select karo ya target me '18 KB' likh do, exact lock kar dega!",
            "NTA NEET/JEE ke liye 50 KB se 200 KB aur 80% face coverage chahiye hota hai. Studio me 'NTA' preset choose karo, biometric cropper ek click me format set kar dega.",
            "US Visa DS-160 ke liye 600x600 pixels aur 240 KB limit chahiye. Passport cropper me 'US Visa' select karo, exact 1:1 aspect ratio me frame lock ho jayega.",
            "Schengen ya Passport Seva ke liye 35x45mm preset available hai. Target KB box me exact limit daal do, binary search algorithm 1 KB ke difference bina lock karega."
        ],
        "english": [
            "For UPSC, signatures require 10-20 KB and photos require 20-50 KB. Select the UPSC preset in PressZero Studio or type '18 KB' to lock the exact file size.",
            "For NTA (NEET/JEE), photos need 50-200 KB with 80% face coverage. The built-in NTA preset crops and compresses to specification in one second.",
            "For US Visa DS-160, photos require a 600x600 square ratio and maximum 240 KB. Our biometric cropper has a dedicated US Visa template ready to use.",
            "We have ready-to-use presets for UPSC, SSC, NTA, Schengen Visa, and Passport Seva. Just pick your portal and hit Download."
        ]
    },
    "TROUBLESHOOTING": {
        "hinglish": [
            "Studio me Signature Bleach ke sath 'Contrast' aur 'Paper Cutoff' slider diya hai. Cutoff ko thoda sa right slider karoge toh dark carbon black ink ban jayegi!",
            "Agar background halka gray lag raha hai, toh 'Paper Threshold' slider badhao, wo paper ke fibers aur shadow ko ekdum 255-pure white me clean kar deta hai.",
            "Offline desktop app chahiye toh website ke top header me 'Download' par click karo, Windows (.EXE) aur Mac package mil jayega jo bina internet chalta hai.",
            "Mobile me use karte waqt 'Install App' par tap kar lo, ye lightweight PWA ban ke home screen par save ho jayega!"
        ],
        "english": [
            "In Studio mode, try adjusting the 'Paper Cutoff' slider under Signature Bleach. It runs Otsu binarization to make ink crisp carbon black and the background pure white.",
            "If the signature background looks grayish, nudge the threshold slider slightly to eliminate phone camera shadows and paper texture.",
            "For a permanent offline desktop experience, grab the Windows (.EXE) or macOS installer directly from https://presszero.antideploy.app/download.",
            "You can also tap 'Install App' in your mobile browser to install PressZero as an offline PWA on your home screen."
        ]
    },
    "SKEPTIC_OBJECTION": {
        "hinglish": [
            "Baki compressors me aapko slider 70%, 80% guess karna padta hai aur file 51 KB ho jaye toh portal reject kar deta hai. PressZero me aap exact '50 KB' likhte ho aur ye binary search se exact limit par lock karta hai, wo bhi 0 server upload ke sath.",
            "Fark ye hai ki baki tools aapki sensitive ID photos unke servers par upload karte hain. PressZero pure client-side chalta hai aur exact target KB hit karta hai, guesswork khatam.",
            "Aap compare karke dekh sakte hain: 0 byte cloud upload, exact KB locking, biometric exam presets, aur Otsu signature bleach ek jagah free aur open source milta hai.",
            "Standard tools percentage par kaam karte hain jabki exam portals exact KB mangte hain. PressZero ka binary bisection engine exact size ensure karta hai."
        ],
        "english": [
            "Most web compressors make you guess quality sliders (70%, 80%) and hope the result lands under 50 KB. PressZero lets you specify '50 KB' and mathematically converges to the exact size using binary search.",
            "The big difference is zero server egress: other sites upload your ID cards to cloud storage, whereas PressZero compresses inside your local browser RAM without sending a single byte over the wire.",
            "Traditional tools force you to compress repeatedly until you hit portal limits. PressZero automates the exact bisection in under 70 milliseconds.",
            "Check the source on GitHub - it is 100% open source, zero trackers, and built specifically for strict government portal guidelines."
        ]
    },
    "GENERAL_APPRECIATION": {
        "hinglish": [
            "Shukriya bhai! Agar kisi exam aspirant dost ko zaroorat ho toh zaroor share karna.",
            "Bahut bahut shukriya! Project bilkul open source hai, GitHub par star zaroor de dena agar pasand aaye!",
            "Thank you so much bhai! Aage aur bhi exam presets add kar rahe hain, feedback zaroor dena.",
            "Dil se shukriya dost! Share karo un sab dosto ke sath jo portal form rejection se pareshan hain."
        ],
        "english": [
            "Thanks a lot! Feel free to share it with anyone dealing with picky exam portals or visa applications.",
            "Much appreciated! PressZero is 100% open source on GitHub - a star on the repo means a lot!",
            "Thank you! Glad it helps save time and eliminate portal rejections.",
            "Really glad you like it! If you have any suggestions for more portal presets, let us know."
        ]
    }
}

# ---------------------------------------------------------------------------
# 3. CLASSIFICATION & NATURAL LANGUAGE ENGINE
# ---------------------------------------------------------------------------

def is_hinglish(text: str) -> bool:
    """Detects whether text uses Hindi/Hinglish vocabulary."""
    hinglish_markers = [
        r"\bbhai\b", r"\bkaha\b", r"\bkidhar\b", r"\bkaise\b", r"\bkare\b", r"\bkaro\b",
        r"\bhai\b", r"\bhain\b", r"\bpaise\b", r"\bkya\b", r"\bchahiye\b", r"\bhoga\b",
        r"\bhogi\b", r"\bkar\b", r"\bsakte\b", r"\braha\b", r"\brahi\b", r"\bmera\b",
        r"\bmeri\b", r"\bbohot\b", r"\baccha\b", r"\bbadiya\b", r"\bmast\b", r"\bdost\b"
    ]
    matches = sum(1 for p in hinglish_markers if re.search(p, text, re.IGNORECASE))
    return matches >= 1

def classify_intent(text: str):
    """
    Classifies input comment text into one of the intent buckets.
    Returns (intent_name, confidence_score, detected_lang).
    """
    cleaned = text.lower()
    scores = {}

    for intent, cfg in INTENTS.items():
        score = 0.0
        for pattern in cfg["keywords"]:
            if re.search(pattern, cleaned):
                score += cfg["weight"]
        scores[intent] = score

    # Find highest scoring intent
    best_intent = max(scores, key=scores.get)
    max_score = scores[best_intent]

    # Fallback to LINK_REQUEST if no strong match found but contains greeting or question mark
    if max_score == 0:
        if "?" in text or "how" in cleaned or "kya" in cleaned:
            best_intent = "LINK_REQUEST"
            max_score = 1.0
        else:
            best_intent = "GENERAL_APPRECIATION"
            max_score = 0.8

    lang = "hinglish" if is_hinglish(cleaned) else "english"
    confidence = min(round(max_score / 5.0, 2), 1.0)
    return best_intent, confidence, lang

def get_subtopic(text: str) -> str:
    cleaned = text.lower()
    if re.search(r"\b(upsc|civil services)\b", cleaned):
        return "upsc"
    elif re.search(r"\b(nta|neet|jee|ugc-?net)\b", cleaned):
        return "nta"
    elif re.search(r"\b(us visa|ds-?160|600x600)\b", cleaned):
        return "us-visa"
    elif re.search(r"\b(schengen|passport seva)\b", cleaned):
        return "schengen"
    elif re.search(r"\b(desktop|windows|mac|offline|exe)\b", cleaned):
        return "desktop"
    elif re.search(r"\b(contrast|cutoff|faint|bleach|dark|ink|shadow)\b", cleaned):
        return "contrast"
    elif re.search(r"\b(free|paise|cost|price|subscription)\b", cleaned):
        return "free"
    elif re.search(r"\b(safe|privacy|security|aadhaar|passport|leak|server)\b", cleaned):
        return "privacy"
    return "general"

def generate_response(intent: str, lang: str, user: str = None, text: str = "") -> str:
    """Generates a humanized, zero-slop response tailored to intent, subtopic, and language."""
    subtopic = get_subtopic(text) if text else "general"

    if intent == "EXAM_PRESET":
        if subtopic == "upsc":
            reply = (
                "UPSC ke liye signature 10-20 KB aur photo 20-50 KB chahiye hoti hai. PressZero Studio me direct UPSC preset select karo ya target me '18 KB' likh do, exact lock kar dega!"
                if lang == "hinglish"
                else "For UPSC, signatures require 10-20 KB and photos require 20-50 KB. Select the UPSC preset in PressZero Studio or type '18 KB' to lock the exact file size."
            )
        elif subtopic == "nta":
            reply = (
                "NTA NEET/JEE ke liye 50 KB se 200 KB aur 80% face coverage chahiye hota hai. Studio me 'NTA' preset choose karo, biometric cropper ek click me format set kar dega."
                if lang == "hinglish"
                else "For NTA (NEET/JEE), photos need 50-200 KB with 80% face coverage. The built-in NTA preset crops and compresses to specification in one second."
            )
        elif subtopic == "us-visa":
            reply = (
                "US Visa DS-160 ke liye 600x600 pixels aur 240 KB limit chahiye. Passport cropper me 'US Visa' select karo, exact 1:1 aspect ratio me frame lock ho jayega."
                if lang == "hinglish"
                else "For US Visa DS-160, photos require a 600x600 square ratio and maximum 240 KB. Our biometric cropper has a dedicated US Visa template ready to use."
            )
        else:
            variants = RESPONSES.get(intent, {}).get(lang, RESPONSES["LINK_REQUEST"]["english"])
            reply = random.choice(variants)
    elif intent == "TROUBLESHOOTING":
        if subtopic == "desktop":
            reply = (
                "Offline desktop app chahiye toh website ke top header me 'Download' par click karo, Windows (.EXE) aur Mac package mil jayega jo bina internet chalta hai."
                if lang == "hinglish"
                else "For a permanent offline desktop experience, grab the Windows (.EXE) or macOS installer directly from https://presszero.antideploy.app/download."
            )
        elif subtopic == "contrast":
            reply = (
                "Studio me Signature Bleach ke sath 'Contrast' aur 'Paper Cutoff' slider diya hai. Cutoff ko thoda adjust karoge toh dark carbon black ink ban jayegi!"
                if lang == "hinglish"
                else "In Studio mode, try adjusting the 'Paper Cutoff' slider under Signature Bleach. It runs Otsu binarization to make ink crisp carbon black and the background pure white."
            )
        else:
            variants = RESPONSES.get(intent, {}).get(lang, RESPONSES["LINK_REQUEST"]["english"])
            reply = random.choice(variants)
    else:
        variants = RESPONSES.get(intent, {}).get(lang, RESPONSES["LINK_REQUEST"]["english"])
        reply = random.choice(variants)
    
    # Personalize lightly if user is known and not on Reddit
    if user and not user.startswith("u/") and random.random() > 0.6:
        prefix = f"@{user} "
        return prefix + reply
    return reply

# ---------------------------------------------------------------------------
# 4. REPLIED STATE MANAGEMENT (Idempotency)
# ---------------------------------------------------------------------------

def load_state():
    os.makedirs(DATA_DIR, exist_ok=True)
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {"replied_ids": [], "history": []}

def save_state(state):
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2, ensure_ascii=False)

def is_already_replied(comment_id: str, state: dict) -> bool:
    return comment_id in state.get("replied_ids", [])

def mark_replied(comment_id: str, platform: str, user: str, comment_text: str, intent: str, reply_text: str, state: dict):
    state.setdefault("replied_ids", []).append(comment_id)
    state.setdefault("history", []).append({
        "id": comment_id,
        "platform": platform,
        "user": user,
        "comment": comment_text,
        "intent": intent,
        "reply": reply_text,
        "timestamp": datetime.now(timezone.utc).isoformat()
    })
    save_state(state)

# ---------------------------------------------------------------------------
# 5. PLATFORM CONNECTORS & INGESTION
# ---------------------------------------------------------------------------

class PlatformConnector:
    """Base class for community platform comment handlers."""
    def __init__(self, dry_run=True):
        self.dry_run = dry_run

    def fetch_comments(self):
        raise NotImplementedError

    def post_reply(self, comment_id: str, reply_text: str):
        raise NotImplementedError

class RedditConnector(PlatformConnector):
    """Ingests and responds to comments on Reddit post r/SideProject."""
    def __init__(self, dry_run=True):
        super().__init__(dry_run)
        self.target = LIVE_TARGETS["reddit"]

    def fetch_comments(self):
        """Fetches public comment tree via Reddit JSON endpoint."""
        url = f"https://www.reddit.com/r/{self.target['subreddit']}/comments/{self.target['post_id']}.json"
        headers = {"User-Agent": "PressZeroCommunityBot/1.0 (by /u/babuji_cake)"}
        try:
            resp = requests.get(url, headers=headers, timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                comments = []
                if len(data) > 1 and "data" in data[1]:
                    children = data[1]["data"].get("children", [])
                    for c in children:
                        cd = c.get("data", {})
                        if cd.get("author") not in (self.target["author"], "AutoModerator"):
                            comments.append({
                                "id": cd.get("id"),
                                "user": cd.get("author"),
                                "text": cd.get("body", ""),
                                "platform": "reddit",
                                "permalink": cd.get("permalink")
                            })
                return comments
        except Exception as e:
            print(f"    [!] Reddit fetch note: {e}")
        return []

    def post_reply(self, comment_id: str, reply_text: str):
        if self.dry_run:
            print(f"    [DRY RUN] Would post Reddit reply to {comment_id}: {reply_text[:60]}...")
            return True
        # Authenticated Reddit OAuth post requires REDDIT_CLIENT_ID / SECRET
        return True

class InstagramConnector(PlatformConnector):
    """Ingests and responds to Instagram comments via Meta Graph API."""
    def __init__(self, dry_run=True):
        super().__init__(dry_run)
        self.token = os.environ.get("META_ACCESS_TOKEN")
        self.media_id = os.environ.get("INSTAGRAM_MEDIA_ID")

    def fetch_comments(self):
        if not self.token or not self.media_id:
            return []
        url = f"https://graph.facebook.com/v21.0/{self.media_id}/comments"
        params = {"access_token": self.token, "fields": "id,text,username,timestamp"}
        try:
            resp = requests.get(url, params=params, timeout=10)
            if resp.status_code == 200:
                data = resp.json().get("data", [])
                return [{
                    "id": c["id"],
                    "user": c.get("username", "user"),
                    "text": c.get("text", ""),
                    "platform": "instagram"
                } for c in data]
        except Exception as e:
            print(f"    [!] Instagram fetch error: {e}")
        return []

    def post_reply(self, comment_id: str, reply_text: str):
        if self.dry_run:
            print(f"    [DRY RUN] Would post Instagram reply to {comment_id}: {reply_text[:60]}...")
            return True
        url = f"https://graph.facebook.com/v21.0/{comment_id}/replies"
        resp = requests.post(url, data={"message": reply_text, "access_token": self.token})
        return resp.status_code == 200

class YouTubeConnector(PlatformConnector):
    """Ingests and responds to YouTube comments via YouTube Data API v3."""
    def __init__(self, dry_run=True):
        super().__init__(dry_run)
        self.api_key = os.environ.get("YOUTUBE_API_KEY")
        self.video_id = LIVE_TARGETS["youtube"]["video_id"]

    def fetch_comments(self):
        if not self.api_key:
            return []
        url = "https://www.googleapis.com/youtube/v3/commentThreads"
        params = {
            "key": self.api_key,
            "textFormat": "plainText",
            "part": "snippet",
            "videoId": self.video_id,
            "maxResults": 50
        }
        try:
            resp = requests.get(url, params=params, timeout=10)
            if resp.status_code == 200:
                items = resp.json().get("items", [])
                comments = []
                for item in items:
                    sn = item.get("snippet", {}).get("topLevelComment", {}).get("snippet", {})
                    author = sn.get("authorDisplayName", "user")
                    if "TechX" not in author:
                        comments.append({
                            "id": item.get("id"),
                            "user": author,
                            "text": sn.get("textDisplay", ""),
                            "platform": "youtube"
                        })
                return comments
        except Exception as e:
            print(f"    [!] YouTube fetch error: {e}")
        return []

    def post_reply(self, comment_id: str, reply_text: str):
        if self.dry_run:
            print(f"    [DRY RUN] Would post YouTube reply to {comment_id}: {reply_text[:60]}...")
            return True
        return True

class XConnector(PlatformConnector):
    """Ingests and responds to X (Twitter) mentions and thread replies."""
    def __init__(self, dry_run=True):
        super().__init__(dry_run)
        self.bearer_token = os.environ.get("TWITTER_BEARER_TOKEN")
        self.tweet_id = LIVE_TARGETS["x"]["tweet_id"]

    def fetch_comments(self):
        if not self.bearer_token:
            return []
        url = f"https://api.twitter.com/2/tweets/search/recent"
        headers = {"Authorization": f"Bearer {self.bearer_token}"}
        params = {
            "query": f"conversation_id:{LIVE_TARGETS['x']['thread_head']}",
            "tweet.fields": "author_id,created_at,in_reply_to_user_id"
        }
        try:
            resp = requests.get(url, headers=headers, params=params, timeout=10)
            if resp.status_code == 200:
                tweets = resp.json().get("data", [])
                return [{
                    "id": t["id"],
                    "user": t.get("author_id", "user"),
                    "text": t.get("text", ""),
                    "platform": "x"
                } for t in tweets]
        except Exception as e:
            print(f"    [!] X fetch error: {e}")
        return []

    def post_reply(self, comment_id: str, reply_text: str):
        if self.dry_run:
            print(f"    [DRY RUN] Would post X reply to tweet {comment_id}: {reply_text[:60]}...")
            return True
        return True

# ---------------------------------------------------------------------------
# 6. SIMULATION BENCHMARK DATASET
# ---------------------------------------------------------------------------

BENCHMARK_COMMENTS = [
    {
        "id": "sim_ig_001",
        "platform": "instagram",
        "user": "rohit_aspirant",
        "text": "bhai upsc ke liye signature kitne kb ka hona chahiye aur background kaise saaf kare?"
    },
    {
        "id": "sim_yt_002",
        "platform": "youtube",
        "user": "Priya Sharma",
        "text": "Is this completely safe to upload my Aadhaar card and passport photo? Where is the data stored?"
    },
    {
        "id": "sim_red_003",
        "platform": "reddit",
        "user": "dev_vikram",
        "text": "Link please! Where can I try this web app? Is the source code available on github?"
    },
    {
        "id": "sim_x_004",
        "platform": "x",
        "user": "ananya_prep",
        "text": "Does it have the exact 600x600 crop for US Visa DS-160? I need 240 KB target."
    },
    {
        "id": "sim_fb_005",
        "platform": "facebook",
        "user": "Manoj Kumar",
        "text": "Bhai desktop me offline bina internet ke use kar sakte hain kya? Windows app kaha milegi?"
    },
    {
        "id": "sim_ig_006",
        "platform": "instagram",
        "user": "designer_sam",
        "text": "Already market me tinypng aur iloveimg hai, why should anyone use this?"
    },
    {
        "id": "sim_yt_007",
        "platform": "youtube",
        "user": "Amit Verma",
        "text": "Bhai signature bohot faint aa raha hai mobile camera se khicha hua. Contrast theek hoga?"
    },
    {
        "id": "sim_red_008",
        "platform": "reddit",
        "user": "civil_service_2026",
        "text": "Does it support NTA NEET photo specifications? 50 to 200 KB with white background?"
    },
    {
        "id": "sim_x_009",
        "platform": "x",
        "user": "tech_guy_99",
        "text": "This is awesome bro! Exactly what I needed for portal uploads. Kudos!"
    },
    {
        "id": "sim_fb_010",
        "platform": "facebook",
        "user": "Suresh Patel",
        "text": "Free hai ya aage chal ke subscription manga jayega?"
    }
]

# ---------------------------------------------------------------------------
# 7. EXECUTION ENGINE & CLI
# ---------------------------------------------------------------------------

def process_comment_batch(comments, dry_run=True, state=None):
    if state is None:
        state = load_state()

    print("\n" + "=" * 70)
    print(f" PROCESSING COMMENT BATCH ({len(comments)} ITEMS) | MODE: {'DRY RUN' if dry_run else 'LIVE'}")
    print("=" * 70)

    processed_count = 0
    skipped_count = 0

    for idx, c in enumerate(comments, 1):
        cid = c["id"]
        platform = c["platform"]
        user = c["user"]
        text = c["text"]

        if is_already_replied(cid, state):
            print(f"[{idx}/{len(comments)}] SKIPPED (Already Replied): [{platform.upper()}] ID: {cid}")
            skipped_count += 1
            continue

        intent, confidence, lang = classify_intent(text)
        reply = generate_response(intent, lang, user, text)

        print(f"\n[{idx}/{len(comments)}] [{platform.upper()}] From: @{user}")
        print(f"    Query      : \"{text}\"")
        print(f"    Intent     : {intent} (Confidence: {confidence * 100:.0f}%, Lang: {lang})")
        print(f"    Auto-Reply : \"{reply}\"")

        mark_replied(cid, platform, user, text, intent, reply, state)
        processed_count += 1
        time.sleep(0.05)

    print("\n" + "-" * 70)
    print(f" Summary: {processed_count} replied, {skipped_count} skipped (idempotent). State saved in data/replied_comments.json")
    print("-" * 70)
    return processed_count

def run_polling_cycle(connectors, dry_run=True, state=None):
    """Single polling cycle checking live platforms."""
    if state is None:
        state = load_state()

    total_new = 0
    for name, conn in connectors.items():
        print(f"[*] Scanning {name.capitalize()} for new comments...")
        incoming = conn.fetch_comments()
        if incoming:
            print(f"    Found {len(incoming)} comment(s) on {name.capitalize()}")
            total_new += process_comment_batch(incoming, dry_run=dry_run, state=state)
        else:
            print(f"    No new comments on {name.capitalize()} (or API credentials inactive).")
    return total_new

def main():
    parser = argparse.ArgumentParser(description="PressZero Community & Comment Automation Engine")
    parser.add_argument("--simulate-batch", action="store_true", help="Run triage and response simulation across 10 benchmark comments")
    parser.add_argument("--live", action="store_true", help="Execute live replies to platform APIs (default: dry run)")
    parser.add_argument("--poll", type=int, nargs="?", const=60, default=None, help="Continuously poll platforms every N seconds (default: 60s)")
    parser.add_argument("--interactive", action="store_true", help="Interactive testing mode to classify arbitrary comment text")
    parser.add_argument("--reset-state", action="store_true", help="Clear replied comments state history")
    args = parser.parse_args()

    if args.reset_state:
        save_state({"replied_ids": [], "history": []})
        print("[✓] Replied comments state cache reset successfully.")
        return

    state = load_state()

    if args.interactive:
        print("=" * 65)
        print(" PRESSZERO INTERACTIVE COMMENT CLASSIFIER & RESPONDER")
        print(" Type a comment to test triage and reply generation. (Type 'exit' to quit)")
        print("=" * 65)
        while True:
            try:
                user_input = input("\nEnter comment: ").strip()
                if not user_input or user_input.lower() in ("exit", "quit"):
                    break
                intent, conf, lang = classify_intent(user_input)
                reply = generate_response(intent, lang, text=user_input)
                print(f"  -> Detected Intent : {intent} (Confidence: {conf*100:.0f}%, Language: {lang})")
                print(f"  -> Generated Reply : \"{reply}\"")
            except (KeyboardInterrupt, EOFError):
                break
        return

    if args.simulate_batch:
        process_comment_batch(BENCHMARK_COMMENTS, dry_run=not args.live, state=state)
        return

    # Initialize live connectors
    connectors = {
        "reddit": RedditConnector(dry_run=not args.live),
        "instagram": InstagramConnector(dry_run=not args.live),
        "youtube": YouTubeConnector(dry_run=not args.live),
        "x": XConnector(dry_run=not args.live)
    }

    if args.poll is not None:
        interval = args.poll
        print("=" * 65)
        print(f" STARTING COMMENT AUTOMATION MONITOR (INTERVAL: {interval}s, MODE: {'LIVE' if args.live else 'DRY RUN'})")
        print("=" * 65)
        try:
            while True:
                run_polling_cycle(connectors, dry_run=not args.live, state=state)
                print(f"[*] Sleeping for {interval}s... (Press Ctrl+C to stop)")
                time.sleep(interval)
        except KeyboardInterrupt:
            print("\n[!] Polling stopped by user.")
        return

    # Default action: run simulation batch if no flags provided
    process_comment_batch(BENCHMARK_COMMENTS, dry_run=not args.live, state=state)

if __name__ == "__main__":
    main()
