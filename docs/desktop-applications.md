# Desktop Native Distributions (Windows & macOS)

PressZero provides dedicated standalone distributions for Windows and macOS, engineered for offline operations, enterprise environments, and biometric scan centers where internet access is restricted.

---

## 🪟 Windows 64-bit Architecture

### 1. Setup Installer (`PressZero-Setup.exe` — 34 KB)
- **Deployment Path**: `%LOCALAPPDATA%\Programs\PressZero\`
- **Privilege Model**: Per-user installation. Requires **no administrative UAC elevation**.
- **Features**:
  - Automatically installs the desktop application runner.
  - Creates Desktop shortcut (`PressZero.lnk`).
  - Creates Start Menu shortcut (`PressZero.lnk`).
  - Generates a standalone `Uninstall.bat` uninstaller script.
  - Launches PressZero immediately upon installation completion.
- **SHA-256 Checksum**: `2182A5A55BB86E7879317563D59268D1F1556633A920A559EC378F170464084F`

### 2. Standalone Portable Runner (`PressZero.exe` — 5 KB)
- Single executable that launches Chrome or Edge in standalone `--app` mode with frameless dimensions (1280×850 px).
- Works from USB drives or read-only network shares.

---

## 🍏 macOS Universal Architecture

### 1. Universal Application Bundle (`PressZero-macOS-Universal.zip` — 41 KB)
- **Supported Chipsets**: **Apple Silicon (M1/M2/M3/M4)** and **Intel (x86_64)**.
- **Target OS**: macOS 11.0 (Big Sur) through macOS 15 (Sequoia)+.
- **Bundle Contents**:
  - `PressZero.app/Contents/Info.plist`: High-DPI Retina metadata, bundle identifier `app.presszero.desktop`.
  - `PressZero.app/Contents/PkgInfo`: `APPLPZRO`.
  - `PressZero.app/Contents/MacOS/PressZero`: Native POSIX shell launcher (`chmod 755`) launching Google Chrome, Microsoft Edge, or Brave in dedicated `--app` window mode, with universal fallback to Safari.
  - `PressZero.app/Contents/Resources/AppIcon.icns`: Apple multi-resolution ICNS icon.
  - `Install-PressZero.command`: Double-clickable installer script (`chmod 755`) that deploys `PressZero.app` to `/Applications` and un-quarantines the app.
- **SHA-256 Checksum**: `2D418F304E42D56A805F6B2710BE95FBDF4BBF1959AAFDB6E4718995194BEF7F`

### 2. Gatekeeper Verification
Because PressZero is distributed directly via open-source GitHub Releases without an Apple Developer ID certificate, macOS Gatekeeper may flag it on first launch:
```bash
# Clear Gatekeeper quarantine flag
xattr -cr /Applications/PressZero.app
```
