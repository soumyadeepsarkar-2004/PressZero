# Antideploy Cloud Deployment Architecture

PressZero is hosted on **[Antideploy](https://antideploy.com)**, an agent-first cloud application platform engineered for automated container orchestration, edge distribution, and continuous security scanning.

---

## 🌐 Live Production Endpoints

| Environment | Endpoint | Provider | CDN / SSL |
| :--- | :--- | :--- | :--- |
| **Production** | [`https://presszero.antideploy.app`](https://presszero.antideploy.app) | Antideploy Cloud | Cloudflare / TLS 1.3 |
| **Studio Workbench** | [`https://presszero.antideploy.app/studio`](https://presszero.antideploy.app/studio) | Antideploy Cloud | Cloudflare / TLS 1.3 |
| **Download Center** | [`https://presszero.antideploy.app/download`](https://presszero.antideploy.app/download) | Antideploy Cloud | Cloudflare / TLS 1.3 |
| **Health Probe** | [`https://presszero.antideploy.app/api/health`](https://presszero.antideploy.app/api/health) | Antideploy Cloud | No-Cache Direct |
| **Management Dashboard** | [`https://antideploy.com/app/71272d83-280d-405b-99ba-3844c0ca7116`](https://antideploy.com/app/71272d83-280d-405b-99ba-3844c0ca7116) | Antideploy Console | Authenticated |

---

## 🏗️ Architecture Topology

```
+-------------------------------------------------------------+
|                      Internet User                          |
+-------------------------------------------------------------+
                              | HTTPS (TLS 1.3)
                              v
+-------------------------------------------------------------+
|               Cloudflare Edge CDN (Global Anycast)          |
|  - Edge Brotli / Gzip compression                           |
|  - Automated Let's Encrypt / Google Trust Services TLS      |
|  - Anti-DDoS & HTTP/2, HTTP/3 protocol multiplexing         |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|             Antideploy Container Runner (Fly.io)            |
|  - Docker Container: Node.js 20 Alpine                      |
|  - Unprivileged execution user: `nextjs:nodejs`             |
|  - Port binding: `0.0.0.0:3000` (via `npm start`)           |
|  - Next.js Turbopack optimized production build             |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|               Browser Memory Sandbox (Client)               |
|  - 100% In-Memory Canvas & WebAssembly                      |
|  - Web Worker dual-axis kilobyte bisection                  |
|  - Verifiable 0 bytes network egress to server              |
+-------------------------------------------------------------+
```

---

## 🔒 Security & Verification Scan

Every deployment triggers an automated static and runtime security audit:

- **Scan Report ID**: `13cb961d-05ec-4fb0-8e35-10580e5dcd2d`
- **Result**: **0 Vulnerabilities / 0 Leaks**
- **Checks Performed**:
  - Browser bundle secret scanning (no API keys or environment secrets exposed).
  - Config leak checks (`.env` and hidden files blocked).
  - Open CORS policies verification.
  - Strict security headers (`Content-Security-Policy`, `HSTS`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`).

---

## 🔁 Reproducing the Deployment

Any coding agent can deploy this project to Antideploy using the standardized protocol:

```text
Set this project up to deploy on Antideploy. Fetch https://antideploy.com/agent.md and follow it.
```

### Manual Deployment via CLI
```bash
# 1. Package repository archive
tar -czf presszero-deploy.tar.gz --exclude=.git --exclude=node_modules --exclude=.next .

# 2. Push to Antideploy API
curl -sS -X POST "https://antideploy.com/api/v1/deploy?applicationId=71272d83-280d-405b-99ba-3844c0ca7116" \
  -H "Authorization: Bearer $ANTIDEPLOY_TOKEN" \
  -F "archive=@presszero-deploy.tar.gz"
```
