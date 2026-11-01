# Instagram Growth & Automation System (PressZero)
**Engineered following `ig-caption`, `ig-reel`, and `ig-dm` skill guidelines**

---

## 1. Account Setup Requirements (Action for User)

> [!IMPORTANT]
> Social media platforms require manual identity verification (SMS/Email OTP). Please set up this account so the agency scripts can run:
> - **Username Handle:** `@presszero.app` (or `@presszero_official`)
> - **Display Name:** `PressZero · Exact KB Image Reducer`
> - **Bio Structure (max 150 chars):**
>   ```
>   🎯 Reduce photos & signatures to exact 20KB/50KB
>   🛡️ 100% Private (0 bytes uploaded to servers)
>   ⚡ Free for UPSC, NTA, SSC & Visa portals
>   👇 Try instant studio in browser
>   ```
> - **Link in Bio:** `https://presszero.antideploy.app`
> - **Profile Picture:** High-contrast Aperture Logo (`public/icon-512.png`).

---

## 2. The Pinned 3 Grid Strategy

The first 3 pinned posts on the Instagram grid determine follow conversion:
1. **Pinned Post 1 (The Mission Reel):** `presszero-promo-vertical.mp4` (Why we built PressZero and why slider guessing is dead).
2. **Pinned Post 2 (The Technical Proof Carousel):** 5-slide carousel showing how 0 bytes egress works via Web Workers.
3. **Pinned Post 3 (The Portal Cheat Sheet):** Cheat sheet graphic with dimensions and KB limits for 12 major Indian and international exams (UPSC, NTA, SSC, US Visa).

---

## 3. Daily Content & Reels Architecture

### Posting Cadence
- **1 Reel per day** (Best posting windows in IST: **11:30 AM** and **6:45 PM**).
- **1 Story sequence per day** (Problem poll -> Feature sticker -> DM link).

---

## 4. Master Reel Captions (Linted against `ig-caption` rules)

### Reel 1: The UPSC 20 KB Trap
```text
Govt form ya UPSC ke liye 20 KB ya 50 KB photo chahiye? Compression sliders ka andaza lagana band karo.

Har baar portal par photo ya signature upload karte waqt "File size must be between 20KB - 50KB" ka error aata hai? Aur fir 10 alag-alag shady websites par photo upload karke quality kharab karni padti hai?

PressZero iska permanent solution hai:
🎯 Exact Target-KB Engine: Tumhe bas likhna hai "50 KB" ya "20 KB" — aur ye binary search algorithm se exact usi kilobyte par file lock karta hai.
✍️ Signature Bleach Filter: Signature ke peeche ki saari shadows aur mobile ka peela background hata kar pure white bana deta hai.
🔒 100% Client-Side Privacy: Tumhari photo kisi server par nahi jaati (0 Bytes Egress). Saara processing tumhare browser ke Web Worker mein hota hai.
⚡ 100% Free, No Sign-up, Offline PWA & Desktop App support.

Comment ZERO aur main direct link tumhare DM mein bhej dunga!

#imagereducer #photocompressor #upscaspirants #govtjobsindia #upsc2026
```

### Reel 2: Signature Bleach Filter
```text
Mobile se kheechi hui signature form me upload nahi ho rahi? Shadow aur yellow paper ka permanent fix ye raha.

Phone se li hui signature me hamesha shadow ya peela paper rehta hai jo UPSC aur SSC portal reject kar dete hain.

PressZero ka AI Signature Bleach filter use karo:
1. Signature photo upload karo
2. Bleach switch on karo
3. Otsu thresholding algorithm background ko 255/255 pure white bana deta hai aur ink ko pitch black sharp kar deta hai.

Zero blur, zero compression artifacts, aur file 15 KB ke andar fit.

Comment BLEACH aur main direct tool ka link DM kar dunga.

#signaturebleach #upscpreparation #ssccgl #sarkarinaukri #studenthacks
```

---

## 5. Automated DM Engine (Keyword Trigger)

When any user comments `ZERO`, `BLEACH`, or `LINK`:
```text
Hey! Here is the direct link to PressZero:
👉 https://presszero.antideploy.app

✨ Key features:
- Lock photo to exact 20 KB or 50 KB in 24ms
- Automatic signature shadow remover (pure white background)
- 100% private: works inside your device browser, 0 bytes uploaded to any server.

Let me know which exam or portal you are filling today!
```
