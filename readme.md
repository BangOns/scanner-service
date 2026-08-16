# Scanner Platform & Agent Monorepo

Platform web modern berbasis **Next.js App Router (Full-Stack Monolith)** untuk mengelola, mendistribusikan, dan memonitor **Scanner Agent** (jembatan localhost HTTP API ke scanner fisik Windows TWAIN/WIA).

---

## 🏗 Struktur Proyek

```text
scanner-service/
├── scanner-platform/           # Next.js Full-Stack Monolith (Product & Config Hub)
│   ├── src/
│   │   ├── app/                # App Router (Thin Route Layer & API Route Handlers)
│   │   │   ├── api/            # Backend REST API (Scanners, Config, Versions, Licenses, Auth)
│   │   │   ├── scanners/       # Scanner Application CRUD & Detail Views
│   │   │   ├── versions/       # Release Management & Checksums
│   │   │   ├── licenses/       # License Key Generation & Quotas
│   │   │   ├── diagnostics/    # Live Testing Console & Localhost Agent Probe
│   │   │   ├── documentation/  # Interactive Developer Integration Guide
│   │   │   └── (auth)/         # Login & Registration
│   │   ├── features/           # Feature-Driven Architecture Modules
│   │   │   ├── Authentication/
│   │   │   ├── Dashboard/
│   │   │   ├── ScannerApplication/
│   │   │   ├── ScannerConfiguration/
│   │   │   ├── Installer/
│   │   │   ├── ScannerAgentVersion/
│   │   │   ├── License/
│   │   │   ├── Documentation/
│   │   │   └── Diagnostics/
│   │   ├── components/         # Primitives (Button, Modal, Card, Input, Badge, Sidebar, Navbar)
│   │   ├── client/             # Contract-First Typed API Client & TanStack Query Hooks
│   │   └── lib/                # Database layer (JSON persistence), Installer Generator & Utils
│   └── package.json
│
├── scanner-agent/              # Standalone Scanner Agent Engine
│   ├── service.js              # Refactored Core: Port Hunting, CORS Whitelist, WIA scan, Logging
│   ├── config.json             # Dynamic runtime configuration
│   ├── installer/              # Templates (.iss, .vbs, .bat)
│   └── README.md
│
├── package.json                # Workspace runner scripts
└── prd.md                      # Product Requirement Document (PRD v2.0)
```

---

## 🚀 Panduan Menjalankan

### 1. Menjalankan Scanner Platform (Web Dashboard)

```bash
# Dari root directory
npm run dev

# Atau masuk ke folder platform
cd scanner-platform
npm run dev
```

Buka **[http://localhost:3000](http://localhost:3000)** di browser Anda.

### 2. Menjalankan Scanner Agent (Lokal)

```bash
# Dari root directory
npm run dev:agent

# Atau masuk ke folder agent
cd scanner-agent
node service.js
```

Agent akan aktif di **`http://127.0.0.1:2019`** (otomatis hunting ke 2020, 2021 jika port sedang dipakai).

---

## ⚡ Fitur Utama

1. **Feature-Driven Architecture**: Struktur modular `src/features/` memisahkan komponen, hook TanStack Query, model, dan section.
2. **Dynamic Installer Generator**: Menghasilkan script Inno Setup (`.iss`), background runner (`run.vbs`), standalone batch installer (`install.bat`), dan konfigurasi JSON per aplikasi.
3. **Multi-Port Hunting & Fallback**: Scanner Agent tidak akan crash jika port 2019 bentrok; otomatis mencari port berikutnya dalam rentang konfigurasi.
4. **CORS / Allowed Origins Security**: Whitelist domain website pengguna secara spesifik.
5. **Live Diagnostics & Test Console**: Uji konektivitas localhost HTTP API, deteksi perangkat WIA, dan uji scan langsung dari browser.
6. **License Key Management**: Penerbitan lisensi per aplikasi (Standard, Pro, Enterprise) dengan masa berlaku dan batas instance.
7. **Semantic Versioning Hub**: Tracking rilisan binary, changelog, dan verifikasi checksum SHA-256.
