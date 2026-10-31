# PressZero Developer Documentation

Welcome to the official developer documentation for **PressZero**, the client-side, zero-knowledge precision image compression engine.

PressZero is engineered to eliminate guesswork percentage sliders by mathematically bisecting image quality and dimensions to hit exact kilobyte targets with guaranteed zero network egress.

---

## 📚 Documentation Index

1. **[System Architecture & Security Model](architecture.md)**
   - Client-side in-memory execution pipeline.
   - Verifiable 0-byte network egress guarantee.
   - Dedicated Web Worker thread isolation.
   - Hardened Content Security Policy (CSP).

2. **[Dual-Axis Binary Search Bisection Engine](bisection-algorithm.md)**
   - $O(\log n)$ quantization search tree.
   - Dimensional downscaling transition mechanics.
   - Tolerance thresholds and sub-25ms convergence.
   - Quality preservation heuristics.

3. **[Signature Bleaching & High-Pass Filtering](signature-bleach.md)**
   - Luminance threshold calculations.
   - Desk shadow and yellow lighting elimination.
   - Ink stroke boosting and paper normalization to pure `#FFFFFF`.

4. **[Government Exam & Biometric Portal Matrix](portal-specifications.md)**
   - NTA / UGC-NET (Photo: 10–200 KB, Signature: 10–50 KB).
   - UPSC Civil Services (Photo: 20–50 KB, Signature: 10–20 KB).
   - US Visa DS-160 (600×600 px, 240 KB ceiling).
   - Schengen Visa (35×45 mm biometric 7:9 ratio).
   - Staff Selection Commission (SSC) specifications.

5. **[Desktop Native Distributions (Windows & macOS)](desktop-applications.md)**
   - Windows standalone runner (`PressZero.exe`) & C# setup installer (`PressZero-Setup.exe`).
   - macOS Universal application bundle (`PressZero.app`) for Apple Silicon (M1–M4) and Intel.
   - Air-gap execution and offline testing procedures.

6. **[API Health & Telemetry Reference](api-health.md)**
   - `GET /api/health` JSON schema.
   - Telemetry fields and memory checks.
   - Uptime monitor and deployment verification.

---

## 🚀 Quick Links
- **Web Studio**: [https://presszero.app/studio](https://presszero.app/studio)
- **Download Center**: [https://presszero.app/download](https://presszero.app/download)
- **GitHub Repository**: [https://github.com/soumyadeepsarkar-2004/PressZero](https://github.com/soumyadeepsarkar-2004/PressZero)
- **GitHub Releases**: [https://github.com/soumyadeepsarkar-2004/PressZero/releases/tag/v1.0.0](https://github.com/soumyadeepsarkar-2004/PressZero/releases/tag/v1.0.0)
- **Machine AI Index**: [https://presszero.app/llms.txt](https://presszero.app/llms.txt)
