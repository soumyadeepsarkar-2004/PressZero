# System Architecture & Security Model

PressZero is architected on a single, uncompromising principle: **all image data is processed in-memory on the user's local machine, and 0 bytes are ever sent over the network.**

---

## 🏛️ End-to-End Execution Topology

```
+-------------------------------------------------------------------------+
|                              USER DEVICE                                |
|                                                                         |
|  [ File Drop / Paste ] ──► [ HTML5 Canvas Element ]                     |
|                                     │                                   |
|                                     ▼                                   |
|                          [ Web Worker Thread Pool ]                     |
|                                     │                                   |
|             ┌───────────────────────┴───────────────────────┐            |
|             ▼                                               ▼            |
|   [ Binary Bisection Engine ]                     [ Bleach Filter ]     |
|   - Quantization loop (O(log n))                  - High-pass luma cut  |
|   - Dimensional downscaler                        - Contrast boost      |
|             │                                               │            |
|             └───────────────────────┬───────────────────────┘            |
|                                     │                                   |
|                                     ▼                                   |
|                     [ In-Memory Blob / JSZip Export ]                   |
|                                     │                                   |
|                                     ▼                                   |
|                    [ Local Download (Zero Egress) ]                     |
+-------------------------------------------------------------------------+
                                      │
                                      X   (No HTTP Requests)
                                      ▼
                        [ Remote Backend Server ]
                       (Zero Bytes Image Egress)
```

---

## 🔒 Security Principles

### 1. Verifiable Zero-Byte Network Egress
- During compression, cropping, bleaching, and ZIP packaging, no image bytes, metadata, or telemetry are transmitted.
- **Verification Method**:
  1. Open Chrome / Edge / Safari Developer Tools.
  2. Switch to the **Network** tab.
  3. Drag an image into PressZero and compress it.
  4. Observe the Network tab: **0 requests** are made during the entire process.

### 2. Multi-Core Web Worker Thread Isolation
- Heavy image quantization loops and canvas pixel manipulation run inside dedicated Web Workers (`public/workers/compression.worker.js`).
- This guarantees:
  - The main UI thread remains 60 FPS silky smooth.
  - Multi-file batches (50+ images) scale across all CPU cores.
  - Workers run in isolated sandboxes without access to cookies, localStorage, or remote DOM APIs.

### 3. Automatic EXIF & Metadata Scrubbing
- Official portals reject files containing geolocation tags, device serial numbers, or extraneous metadata.
- When PressZero draws an image to the canvas and re-encodes it, all GPS coordinates, camera serials, thumbnail caches, and private EXIF tags are completely sanitized.

### 4. Content Security Policy (CSP)
PressZero ships with hardened HTTP response headers:
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self';
```
The `connect-src 'self'` directive ensures the browser strictly blocks any unauthorized outgoing requests to third-party endpoints.
