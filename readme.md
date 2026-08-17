# 🖨️ Scanner Agent Engine

Core daemon & jembatan (*localhost HTTP bridge*) berkecepatan tinggi yang menghubungkan website modern ke hardware scanner fisik (Windows TWAIN/WIA dan Linux SANE).

---

## 🏗 Struktur Proyek

```text
scanner-service/
├── .github/
│   └── workflows/
│       ├── ci.yml              # CI Syntax & Integrity Validation
│       └── release-agent.yml   # Multi-OS Automated Release (.exe & Linux ELF)
├── installer/                  # Template Installer Windows (.iss, .vbs, .bat)
├── service.js                  # Core Engine (Port Hunting, CORS Whitelist, WIA/SANE, REST API)
├── config.json                 # Runtime Dynamic Configuration
├── start-linux.sh              # Quick Runner Linux/macOS (Bash/POSIX)
├── start.fish                  # Quick Runner Fish Shell
├── package.json                # Project & Build Scripts
└── prd.md                      # Product Requirement Document
```

---

## 🚀 Panduan Menjalankan

### Menjalankan Scanner Agent (Lokal)

```bash
# Menjalankan langsung dengan npm
npm start

# Atau langsung dengan node
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
   - Berjalan otomatis saat ada tag versi (misal: `git tag v2.1.0 && git push origin v2.1.0`) atau ditrigger manual via Actions tab.
   - Runner `windows-latest` $\rightarrow$ mengompilasi `ScannerAgent.exe` + ZIP bundle + SHA-256 checksum.
   - Runner `ubuntu-latest` $\rightarrow$ mengompilasi `scanner-agent-linux` + tar.gz bundle + SHA-256 checksum.
   - Mengunggah semua asset ke **GitHub Releases**.
