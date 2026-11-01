# PressZero — Reddit Launch Posts

> Tailored for specific subreddits with authentic, non-spammy framing.
> Focus on problem solved, zero-knowledge architecture, and open-source contribution.

---

### 1. r/webdev
**Title**: I got tired of shady image compressors uploading my IDs to the cloud, so I built a 100% client-side exact-target KB compressor (Next.js + WebAssembly)

**Body**:
Hey r/webdev!

Every time I’ve had to apply for a visa or government exam (like UPSC or Schengen), the portal always had ridiculous requirements: "Must be under 50 KB, pure white background, exact 35x45mm dimensions".

The existing tools drove me nuts:
1. Online compressors (TinyPNG, etc.) upload your sensitive passport/PAN photos to their servers.
2. They give you vague "quality" percentage sliders. Slide to 80%? 74 KB. Slide to 65%? 35 KB blurry mess. You never get exact KB without trial and error.

So I built **PressZero** (https://presszero.antideploy.app) — an open-source, zero-knowledge image reducer that runs completely client-side.

**How it works technically:**
- **Exact-KB Bisection**: Instead of guessing percentages, a Web Worker binary search loop brackets the quantization tables in real-time, converging within ~60ms to hit your exact target (e.g. 49.8 KB for a 50 KB limit).
- **Otsu Dynamic Thresholding**: A custom signature bleach filter analyzes local luminance variance and bleaches phone photos of signatures to pure RGB(255, 255, 255) white without thinning pen strokes.
- **Biometric Smart Cropping**: Canvas-based reticles with built-in aspect ratios matching consulate guidelines (US Visa 2x2in, Schengen 35x45mm, etc.).
- **Zero-Knowledge**: Enforced via strict Content Security Policy. 0 bytes of media egress. Works completely offline as a PWA.

It's 100% free with no ads, tracking, or accounts:
- Web: https://presszero.antideploy.app
- GitHub: https://github.com/soumyadeepsarkar-2004/PressZero

Feedback and PRs welcome!

---

### 2. r/opensource & r/privacy
**Title**: PressZero: A 100% Client-Side, Zero-Knowledge Image Reducer for Sensitive Documents (Aadhaar, Passports, Signatures)

**Body**:
Most people don't realize that when they compress photos of their passport or government ID on free web compressors, their biometric data is sent to unknown remote servers.

I built **PressZero** to provide a privacy-first alternative:
- 0 Bytes Egress: All image processing runs inside Web Workers on your device.
- Exact-target compression: Solves government portal upload rejection by hitting exact KB limits.
- Signature Bleach: Cleans mobile phone shadows on paper to pure 255-white background.
- Open Source (MIT) & Installable as an offline PWA.

Repository: https://github.com/soumyadeepsarkar-2004/PressZero
Live App: https://presszero.antideploy.app

---

### 3. r/india (For UPSC, SSC, Govt Job aspirants)
**Title**: Built a free, ad-free tool to resize photos & signatures for UPSC, SSC, and Passport Seva without uploading to random websites

**Body**:
If you've ever filled out an application on UPSC, SSC, NTA NEET, or Passport Seva, you know how annoying the photo upload errors are ("File size must be between 20 KB and 50 KB", "Signature must have white background").

I built a free tool called **PressZero** to fix this once and for all:
1. You type "50 KB" and it automatically compresses your 5 MB photo to exactly 49.8 KB without guessing.
2. If your signature photo has shadows or yellow paper, the "Signature Bleach" button makes the background pure white.
3. Built-in presets for UPSC, SSC, and Passports.
4. 100% Private: It works in your browser and does NOT upload your photos anywhere. Works completely offline too.

Use it for free: https://presszero.antideploy.app
Open source on GitHub: https://github.com/soumyadeepsarkar-2004/PressZero
