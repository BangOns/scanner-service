# 🖨️ Scanner Agent Engine

Core daemon & jembatan (*localhost HTTP bridge*) berkecepatan tinggi yang menghubungkan website modern ke scanner fisik (Windows TWAIN/WIA dan Linux SANE).

---

## 🏗 Struktur Proyek

```text
scanner-service/
├── scanner-agent/              # Standalone Scanner Agent Engine
│   ├── service.js              # Core: Port Hunting, CORS Whitelist, WIA/SANE Scan, Logging
│   ├── config.json             # Dynamic runtime configuration
│   ├── installer/              # Templates (.iss, .vbs, .bat)
│   ├── start-linux.sh          # Quick runner Linux
│   └── package.json
├── .github/
│   └── workflows/
│       ├── ci.yml              # CI Syntax & Integrity Validation
│       └── release-agent.yml   # Multi-OS Automated Release (.exe & Linux ELF)
└── package.json
```

---

## 🚀 Panduan Menjalankan

### Menjalankan Scanner Agent (Lokal)

```bash
# Dari root directory
npm run start

# Atau masuk ke folder agent
cd scanner-agent
node service.js
```

Agent akan aktif di **`http://127.0.0.1:2019`** (otomatis hunting ke port 2020-2030 jika port 2019 sedang dipakai).

---

## 📦 Kompilasi Binary Standalone

```bash
# Build untuk Windows (.exe)
npm run build:win

# Build untuk Linux (ELF executable)
npm run build:linux
```

---

## 🔄 CI/CD Workflows (GitHub Actions)

1. **`CI Pipeline` (`.github/workflows/ci.yml`)**:
   - Memvalidasi sintaks JavaScript dan integritas konfigurasi JSON pada Node 18 & 20.
2. **`Release Scanner Agent` (`.github/workflows/release-agent.yml`)**:
   - Berjalan otomatis saat ada tag versi (misal: `git tag v2.1.0 && git push origin v2.1.0`).
   - Runner `windows-latest` $\rightarrow$ mengompilasi `ScannerAgent.exe` + ZIP bundle + SHA-256.
   - Runner `ubuntu-latest` $\rightarrow$ mengompilasi `scanner-agent-linux` + tar.gz bundle + SHA-256.
   - Mengunggah semua asset ke **GitHub Releases**.
