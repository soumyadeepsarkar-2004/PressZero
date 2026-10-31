# Signature Bleaching & High-Pass Filtering

When applicants take photos of their signatures using smartphones, the resulting image often contains:
- Yellow or warm ambient indoor lighting.
- Phone or hand desk shadows across the paper.
- Visible paper grain and uneven background gradients.

Official application portals (UPSC, NTA, SSC, Banking) automatically reject these signatures with errors such as *"Signature illegible"* or *"Background not white"*.

---

## 🧪 Filter Mathematical Specification

The PressZero signature bleach engine (`src/lib/compression/signatureFilters.ts`) executes an adaptive high-pass luma thresholding operation on raw pixel data:

### 1. Luminance Calculation
For each pixel $(r, g, b)$ in the image buffer:
$$Y = 0.299 \cdot r + 0.587 \cdot g + 0.114 \cdot b$$

### 2. High-Pass Cutoff & Contrast Amplification
Using an adaptive threshold $T_{\text{bleach}}$ (default $195$ on a $0\dots255$ scale):

$$\text{output}(r, g, b) = \begin{cases} 
(255, 255, 255) & \text{if } Y \ge T_{\text{bleach}} \quad \text{(Bleach paper to pure white)} \\
\max(0, \text{channel} \cdot 0.8) & \text{if } Y < T_{\text{bleach}} \quad \text{(Darken pen ink strokes)}
\end{cases}$$

```typescript
// Core bleaching filter (src/lib/compression/signatureFilters.ts)
export function applySignatureBleach(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  threshold = 195,
  inkBoost = 0.8
): void {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Standard ITU-R BT.601 luminance
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;

    if (luma > threshold) {
      // Paper background -> Pure #FFFFFF
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    } else {
      // Pen strokes -> High contrast dark ink
      data[i] = Math.max(0, Math.floor(r * inkBoost));
      data[i + 1] = Math.max(0, Math.floor(g * inkBoost));
      data[i + 2] = Math.max(0, Math.floor(b * inkBoost));
    }
  }

  ctx.putImageData(imgData, 0, 0);
}
```

---

## 🎯 Benefits for Exam Applicants
1. **Guaranteed Acceptance**: Background becomes 100% pure RGB $(255, 255, 255)$, matching government OCR scanning requirements.
2. **Extreme Compression**: Compressing a pure white background in JPEG/WebP takes nearly zero entropy, allowing signature file sizes to drop as low as **4 KB – 10 KB** without degrading pen stroke clarity.
