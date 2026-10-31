# Government Exam & Biometric Portal Matrix

PressZero includes pre-calibrated presets matching official portal regulations across major testing agencies and visa authorities.

---

## 📋 Comprehensive Portal Matrix

| Portal / Authority | Document Type | Allowed File Size | Dimensions / Ratio | Format | Portal Rejection Causes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **NTA (NEET / JEE / UGC-NET)** | Candidate Photograph | **10 KB – 200 KB** | 3.5 × 4.5 cm (7:9 ratio) | JPG / JPEG | File > 200 KB, face coverage < 80% |
| **NTA (NEET / JEE / UGC-NET)** | Signature | **4 KB – 30 KB** | 3.5 × 1.5 cm | JPG / JPEG | Dark/shadowed background, size < 4 KB |
| **UPSC Civil Services** | Photograph | **20 KB – 50 KB** | 350 × 350 px (min) to 1000 × 1000 px | JPG | Size < 20 KB or > 50 KB, aspect ratio not 1:1 |
| **UPSC Civil Services** | Signature | **10 KB – 20 KB** | 350 × 350 px (min) | JPG | Size > 20 KB, blurry ink |
| **SSC (Staff Selection Commission)** | Photo & Signature | **20 KB – 50 KB** (photo) / **10–20 KB** (sign) | 3.5 × 4.5 cm / 4.0 × 2.0 cm | JPG | Missing white background, spectacles glare |
| **US Visa (DS-160 / CEAC)** | Visa Photo | **Under 240 KB** | Exactly 600 × 600 px (2" × 2" at 300 DPI) | JPG | Dimensions not square, head height not 50–69% |
| **Schengen Visa** | Biometric Photograph | **Under 150 KB** | Exactly 35 × 45 mm (300 DPI: 413 × 531 px) | JPG | Off-center eyes, shadows, non-neutral expression |
| **Passport Seva (India)** | Applicant Photo | **Under 100 KB** | 4.5 × 3.5 cm | JPG | Low contrast, colored background |

---

## ⚡ Using Presets in Code

```typescript
import { PORTAL_PRESETS } from "@/lib/presets/portalMatrix";

// Lookup preset by identifier
const upscPhoto = PORTAL_PRESETS.find(p => p.id === "upsc-photo");
console.log(`Target: ${upscPhoto.targetKB} KB, Ratio: ${upscPhoto.aspectRatio}`);
```
