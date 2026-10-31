# API Health & Telemetry Reference

PressZero exposes a lightweight, dynamic JSON endpoint at `/api/health` for uptime monitors, container orchestration liveness probes, and zero-knowledge privacy verification.

---

## 📡 Endpoint Specification

### `GET /api/health`

Returns server telemetry, edge cache verification, and zero-storage retention certification.

#### Response Headers
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Cache-Control: no-cache, no-store, must-revalidate
```

#### Response Body (JSON)
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "service": "PressZero Precision Image Compression Engine",
  "architecture": {
    "compute": "client-side-in-memory",
    "zeroKnowledge": true,
    "serverStorageRetentionBytes": 0,
    "networkEgressBytes": 0,
    "workerOffloading": true,
    "airgapCertified": true
  },
  "uptime": 1284.52,
  "timestamp": "2026-10-31T17:15:00.000Z",
  "system": {
    "memoryCheck": "nominal",
    "edgeCacheStatus": "active",
    "pwaManifest": "valid"
  }
}
```

---

## 🧪 Integration with Probes

### Docker Healthcheck Example
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1
```

### Kubernetes Liveness / Readiness Probe
```yaml
livenessProbe:
  httpGet:
    path: /api/health
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 15
```
