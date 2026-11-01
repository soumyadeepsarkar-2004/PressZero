/**
 * PressZero Community Comment Intent Classifier & Zero-Slop Response Engine
 * Used by webhooks, platform responders, and community bot automation.
 */

export type CommentIntent =
  | "LINK_REQUEST"
  | "PRIVACY_SECURITY"
  | "EXAM_PRESET"
  | "TROUBLESHOOTING"
  | "SKEPTIC_OBJECTION"
  | "GENERAL_APPRECIATION";

export interface ClassificationResult {
  intent: CommentIntent;
  confidence: number;
  language: "hinglish" | "english";
  subTopic?: string;
  response: string;
}

const HINGLISH_MARKERS = [
  /\bbhai\b/i,
  /\bkaha\b/i,
  /\bkidhar\b/i,
  /\bkaise\b/i,
  /\bkare\b/i,
  /\bkaro\b/i,
  /\bhai\b/i,
  /\bhain\b/i,
  /\bpaise\b/i,
  /\bkya\b/i,
  /\bchahiye\b/i,
  /\bhoga\b/i,
  /\bhogi\b/i,
  /\bkar\b/i,
  /\bsakte\b/i,
  /\braha\b/i,
  /\brahi\b/i,
  /\bmera\b/i,
  /\bmeri\b/i,
  /\bbohot\b/i,
  /\baccha\b/i,
  /\bbadiya\b/i,
  /\bmast\b/i,
  /\bdost\b/i,
];

export function isHinglish(text: string): boolean {
  return HINGLISH_MARKERS.some((p) => p.test(text));
}

export function classifyComment(text: string, user?: string): ClassificationResult {
  const cleaned = text.toLowerCase();
  const lang: "hinglish" | "english" = isHinglish(text) ? "hinglish" : "english";

  // Check sub-topics for high specificity
  let subTopic: string | undefined = undefined;

  // 1. Specific Exam Presets
  if (/\b(upsc|civil services)\b/i.test(cleaned)) {
    subTopic = "upsc";
  } else if (/\b(nta|neet|jee|ugc-net)\b/i.test(cleaned)) {
    subTopic = "nta";
  } else if (/\b(us visa|ds-160|600x600)\b/i.test(cleaned)) {
    subTopic = "us-visa";
  } else if (/\b(schengen|passport seva)\b/i.test(cleaned)) {
    subTopic = "schengen";
  } else if (/\b(desktop|windows|mac|offline|exe)\b/i.test(cleaned)) {
    subTopic = "desktop";
  } else if (/\b(contrast|cutoff|faint|bleach|dark|ink|shadow)\b/i.test(cleaned)) {
    subTopic = "signature-bleach";
  } else if (/\b(free|paise|cost|price|subscription)\b/i.test(cleaned)) {
    subTopic = "free";
  } else if (/\b(safe|privacy|security|aadhaar|passport|leak|server)\b/i.test(cleaned)) {
    subTopic = "privacy";
  }

  // Intent classification scoring
  let intent: CommentIntent = "LINK_REQUEST";
  let confidence = 0.8;

  if (subTopic === "privacy" || /\b(safe|leak|security|privacy|stored|cloud|database|egress)\b/i.test(cleaned)) {
    intent = "PRIVACY_SECURITY";
    confidence = 0.95;
  } else if (
    subTopic === "upsc" ||
    subTopic === "nta" ||
    subTopic === "us-visa" ||
    subTopic === "schengen" ||
    /\b(exam|portal|preset|signature|photo size|20kb|50kb|10kb|aspect ratio)\b/i.test(cleaned)
  ) {
    intent = "EXAM_PRESET";
    confidence = 0.95;
  } else if (
    subTopic === "desktop" ||
    subTopic === "signature-bleach" ||
    /\b(contrast|cutoff|blurry|blur|error|bug|issue|download|install|pwa)\b/i.test(cleaned)
  ) {
    intent = "TROUBLESHOOTING";
    confidence = 0.9;
  } else if (/\b(already|tinypng|iloveimg|photoshop|competitor|market me|why use|what is new)\b/i.test(cleaned)) {
    intent = "SKEPTIC_OBJECTION";
    confidence = 0.9;
  } else if (/\b(awesome|great|helpful|op|nice|mast|super|love it|kudos|thanks|thank you)\b/i.test(cleaned)) {
    intent = "GENERAL_APPRECIATION";
    confidence = 0.85;
  } else {
    intent = "LINK_REQUEST";
    confidence = 0.75;
  }

  // Response generation with zero AI slop
  let response = "";

  if (intent === "EXAM_PRESET") {
    if (subTopic === "upsc") {
      response =
        lang === "hinglish"
          ? "UPSC ke liye signature 10-20 KB aur photo 20-50 KB chahiye hoti hai. PressZero Studio me direct 'UPSC' preset select karo ya target me '18 KB' likh do, exact lock kar dega!"
          : "For UPSC, signatures require 10-20 KB and photos require 20-50 KB. Select the UPSC preset in PressZero Studio or set target to '18 KB' to lock the exact file size.";
    } else if (subTopic === "nta") {
      response =
        lang === "hinglish"
          ? "NTA NEET/JEE ke liye 50 KB se 200 KB aur 80% face coverage chahiye hota hai. Studio me 'NTA' preset choose karo, biometric cropper ek second me format set kar dega."
          : "For NTA (NEET/JEE), photos need 50-200 KB with 80% face coverage. The built-in NTA preset crops and compresses to specification in one second.";
    } else if (subTopic === "us-visa") {
      response =
        lang === "hinglish"
          ? "US Visa DS-160 ke liye 600x600 pixels aur 240 KB limit chahiye. Passport cropper me 'US Visa' select karo, exact 1:1 aspect ratio me frame lock ho jayega."
          : "For US Visa DS-160, photos require 600x600 square ratio and maximum 240 KB. Our biometric cropper has a dedicated US Visa template ready to use.";
    } else {
      response =
        lang === "hinglish"
          ? "PressZero Studio me UPSC, SSC, NTA, Schengen Visa aur Passport Seva ke ready presets hain. Target KB box me exact limit daal do, binary search algorithm 1 KB ke difference bina lock karega."
          : "We have ready-to-use presets for UPSC, SSC, NTA, Schengen Visa, and Passport Seva. Just pick your portal and hit Download.";
    }
  } else if (intent === "PRIVACY_SECURITY") {
    response =
      lang === "hinglish"
        ? "PressZero ka sabse bada feature hi 0 Bytes Egress hai! Tumhari photo kisi server par nahi jaati, saara compression phone/laptop ke browser RAM me hota hai. Internet band karke airplane mode me test kar lo!"
        : "Zero Bytes Egress is our core promise. Your files never touch a remote server; everything processes locally in your browser memory via WebAssembly. You can test it in airplane mode!";
  } else if (intent === "TROUBLESHOOTING") {
    if (subTopic === "desktop") {
      response =
        lang === "hinglish"
          ? "Offline desktop app chahiye toh website ke top header me 'Download' par click karo, Windows (.EXE) aur Mac package mil jayega jo bina internet chalta hai."
          : "For a permanent offline desktop experience, grab the Windows (.EXE) or macOS installer directly from https://presszero.antideploy.app/download.";
    } else {
      response =
        lang === "hinglish"
          ? "Studio me Signature Bleach ke sath 'Contrast' aur 'Paper Cutoff' slider diya hai. Cutoff ko thoda adjust karoge toh dark carbon black ink aur pure white paper ban jayega!"
          : "In Studio mode, try adjusting the 'Paper Cutoff' slider under Signature Bleach. It runs Otsu binarization to make ink crisp carbon black and the background pure white.";
    }
  } else if (intent === "SKEPTIC_OBJECTION") {
    response =
      lang === "hinglish"
        ? "Baki compressors me aapko slider 70%, 80% guess karna padta hai aur file 51 KB ho jaye toh portal reject kar deta hai. PressZero me aap exact '50 KB' likhte ho aur ye binary search se exact limit par lock karta hai, wo bhi 0 server upload ke sath."
        : "Most web compressors make you guess quality sliders (70%, 80%) and hope the result lands under 50 KB. PressZero lets you specify '50 KB' and mathematically converges to the exact size using binary search with zero server uploads.";
  } else if (intent === "GENERAL_APPRECIATION") {
    response =
      lang === "hinglish"
        ? "Shukriya bhai! Agar kisi exam aspirant dost ko zaroorat ho toh zaroor share karna. Project 100% open source hai!"
        : "Thanks a lot! Feel free to share it with anyone dealing with picky exam portals or visa applications.";
  } else {
    // LINK_REQUEST
    response =
      lang === "hinglish"
        ? "Bhai direct link ye raha: https://presszero.antideploy.app - bina kisi sign-up ya email ke browser me turant chalega, 100% free hai!"
        : "Here is the direct link: https://presszero.antideploy.app - completely free, no sign-up or installation required!";
  }

  if (user && !user.startsWith("u/") && Math.random() > 0.5) {
    response = `@${user} ${response}`;
  }

  return {
    intent,
    confidence,
    language: lang,
    subTopic,
    response,
  };
}
