import os
import sys

# Add scripts directory
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), "scripts"))

from comment_responder import classify_intent, generate_response
from autonomous_social_agent import load_calendar

def test_intent_classification():
    queries = [
        ("Where can I find the link to the website?", "LINK_REQUEST"),
        ("Aadhaar card upload safe hai kya isme? Server pe save hota hai kya?", "PRIVACY_SECURITY"),
        ("Bhai UPSC photo me 80% face coverage guidelines ke hisaab se crop hota hai?", "EXAM_PRESET"),
        ("Signature contrast is too faint, how do I threshold it?", "TROUBLESHOOTING"),
        ("Why use this when tinypng and iloveimg already exist?", "SKEPTIC_OBJECTION"),
        ("Super useful tool bro, awesome work!", "GENERAL_APPRECIATION"),
    ]
    for q, expected_intent in queries:
        intent, conf, lang = classify_intent(q)
        reply = generate_response(intent, lang, "user", q)
        print(f"[TEST] Query: '{q[:35]}...' -> Intent: {intent} ({conf*100:.0f}%, {lang})")
        assert intent == expected_intent, f"Expected {expected_intent}, got {intent}"
        assert len(reply) > 20, "Reply too short"
        assert "—" not in reply, "AI slop em dash detected"

def test_growth_calendar():
    cal = load_calendar()
    pipeline = cal.get("pipeline", [])
    assert len(pipeline) == 3, f"Expected 3 pipeline items, got {len(pipeline)}"
    assert pipeline[0]["id"] == "reel_01_launch"
    assert pipeline[0]["status"] == "LIVE"
    assert pipeline[1]["status"] == "RENDERED_AND_READY"
    assert pipeline[2]["status"] == "RENDERED_AND_READY"
    assert os.path.exists(os.path.join(os.path.dirname(os.path.dirname(__file__)), pipeline[1]["asset"])), "Reel 2 video missing"
    assert os.path.exists(os.path.join(os.path.dirname(os.path.dirname(__file__)), pipeline[2]["asset"])), "Reel 3 video missing"
    print(f"[TEST] Growth calendar & rendered MP4 video assets verified: {len(pipeline)} reels ready.")

if __name__ == "__main__":
    test_intent_classification()
    test_growth_calendar()
    print("\n✅ All Agent Unit Tests & Growth Pipeline Checks Passed Successfully!")
