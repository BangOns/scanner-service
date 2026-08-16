# PRD — Scanner Platform v3.0

## 1. Ringkasan

Scanner Platform adalah platform berbasis Next.js yang memungkinkan developer/perusahaan membuat dan mengelola Scanner Application untuk menghubungkan website dengan scanner fisik Windows.

**Prinsip UX utama:**

```text
Create Scanner
→ Configure
→ Create
→ Download Installer
→ Double Click .exe
→ Install
→ Scanner Agent otomatis berjalan
→ Customer Website mendeteksi /health
→ Scanner siap digunakan
```

Customer **tidak perlu menggunakan CMD, Node.js, npm, pkg, Inno Setup, VBScript, atau Task Scheduler** untuk instalasi normal.

---

## 2. Latar Belakang

Scanner Service existing sudah digunakan untuk aplikasi seperti Selaras dan Perwabkeu. Core-nya adalah `service.js` yang menjalankan local HTTP API dan berkomunikasi dengan scanner melalui TWAIN/WIA.

Arsitektur:

```text
Customer Website
      ↓
127.0.0.1:<port>
      ↓
Scanner Agent (.exe)
      ↓
TWAIN / WIA
      ↓
Physical Scanner
```

Scanner Agent dan Scanner Platform adalah **dua project terpisah**.

---

## 3. Product Boundary

### Scanner Agent

Bertanggung jawab atas:

- local HTTP server
- scanner detection
- TWAIN/WIA
- scan
- cancel
- health check
- port management
- logging
- version
- Windows background execution
- installer

`service.js` tetap menjadi basis/core Scanner Agent dan tidak diberikan kepada customer.

### Scanner Platform

Bertanggung jawab atas:

- authentication
- customer management
- Scanner Application
- configuration
- installer distribution
- version/release management
- documentation
- license pada tahap lanjutan

### Customer Website

Bertanggung jawab atas:

- UI scanner
- business logic
- preview
- generate PDF
- nama file hasil scan
- upload/storage
- workflow dokumen

---

## 4. Target User

### Admin / Platform Owner

Mengelola release, Scanner Agent, installer, configuration template, customer, dan dokumentasi.

### Developer / Customer

Membuat Scanner Application, menentukan konfigurasi yang diizinkan, mendapatkan installer, dan mengintegrasikan API.

### End User

Hanya meng-install installer dan menggunakan scanner melalui website customer.

---

## 5. Teknologi Platform

Scanner Platform menggunakan:

```text
Next.js
Next.js App Router
TypeScript
Full-Stack Monolith
```

Frontend dan backend berada dalam satu project.

Scanner Agent tetap project terpisah.

---

## 6. Architecture Standard

Implementasi Scanner Platform wajib mengikuti `SKILL.md` project.

Prinsip:

- Feature-Driven Architecture
- thin routing layer
- separation of concerns
- contract-first API
- generated API client/types
- reusable UI primitives
- strict typing
- URL sebagai source of truth untuk search/filter/pagination
- loading/error state
- mutation feedback

Contoh:

```text
src/
├── app/
├── features/
│   ├── Authentication/
│   ├── Dashboard/
│   ├── ScannerApplication/
│   ├── ScannerConfiguration/
│   ├── Installer/
│   ├── ScannerAgentVersion/
│   ├── License/
│   └── Documentation/
├── components/
├── client/
└── lib/
```

---

## 7. Authentication

Minimum:

```text
Register
Login
Logout
Forgot Password
Reset Password
```

Role:

```text
Admin
Customer / Developer
```

---

## 8. Dashboard

Customer dashboard minimal:

```text
Total Scanner
Active Scanner
Latest Agent Version
License Status
```

---

## 9. Scanner Application

Customer dapat memilih:

```text
+ Create Scanner
```

Form minimal:

```text
Application Name
Company Name
Description
Executable Name
Port Configuration
Allowed Origins
```

Contoh:

```text
Application Name:
Scanner B

Executable Name:
ScannerB.exe

Port:
Auto

Allowed Origins:
https://app.customer.com
```

Setiap Scanner Application memiliki ID unik:

```text
app_8f32jd92
```

---

## 10. Custom Executable

Customer dapat menentukan nama executable sesuai aturan platform.

Contoh:

```text
ScannerB.exe
MyCompanyScanner.exe
CompanyScanner.exe
```

Platform harus memvalidasi nama tersebut.

Customer **tidak dapat mengubah source code `service.js`**.

---

## 11. Installer

Ini adalah bagian utama produk.

Customer mendapatkan installer siap pakai:

```text
ScannerB-Setup.exe
```

Customer **tidak membuat installer sendiri**.

Flow:

```text
Create Scanner
      ↓
Prepare Installer
      ↓
Download
      ↓
ScannerB-Setup.exe
```

---

## 12. Instalasi Customer

Installer harus memberikan pengalaman seperti aplikasi Windows biasa:

```text
Scanner B Setup

Welcome
  ↓
Installation Location
  ↓
Install
  ↓
Installing...
  ↓
Finish
```

Setelah selesai:

```text
Scanner Agent otomatis berjalan
```

Customer tidak perlu:

```text
CMD
PowerShell
Node.js
npm
pkg
Inno Setup
VBScript
Task Scheduler
```

Command hanya boleh muncul pada dokumentasi troubleshooting advanced/internal support.

---

## 13. Internal Build Pipeline

Build adalah tanggung jawab platform owner/developer.

```text
Existing service.js
       ↓
Official Scanner Agent Build
       ↓
ScannerB.exe
       ↓
Installer Build
       ↓
ScannerB-Setup.exe
       ↓
Verification
       ↓
Publish
       ↓
Customer Download
```

Customer tidak melihat proses tersebut.

Platform **tidak boleh** menerima arbitrary source code dari customer untuk kemudian mengeksekusinya di server.

---

## 14. Scanner Agent API

Minimum API:

```text
GET  /
GET  /health
GET  /devices
POST /scan
POST /cancel
```

Kontrak request/response harus mengikuti implementasi `service.js` existing.

Breaking change wajib menggunakan versioning.

---

## 15. Root Endpoint / index.html

`GET /` menampilkan halaman sederhana Scanner Agent.

Contoh:

```text
Scanner Agent

✓ Service Running

Version: 1.0.0
Port: 2021

Available API:

GET  /health
GET  /devices
POST /scan
POST /cancel
```

Halaman ini juga menyediakan tutorial singkat tentang cara menggunakan API.

Harus dijelaskan bahwa endpoint action seperti:

```text
/health
/devices
/scan
/cancel
```

dapat dipanggil oleh website customer dan UI/action akhirnya dapat dibuat sesuai kebutuhan aplikasi customer.

---

## 16. Health Check

```text
GET /health
```

Contoh:

```json
{
  "success": true,
  "service": "scanner-agent",
  "version": "1.0.0",
  "port": 2021
}
```

Website customer dapat melakukan:

```text
Checking...
    ↓
GET /health
    ↓
🟢 Scanner Service aktif
```

atau:

```text
🔴 Scanner Service belum terinstall / tidak berjalan
```

---

## 17. Device Discovery

```text
GET /devices
```

Contoh:

```json
{
  "success": true,
  "devices": [
    {
      "id": "scanner-001",
      "name": "HP ScanJet Pro"
    }
  ]
}
```

---

## 18. Scan

```text
POST /scan
```

Menjalankan proses scan.

Detail request/response harus mengikuti service existing.

---

## 19. Cancel

```text
POST /cancel
```

Membatalkan proses scan apabila didukung oleh Scanner Agent.

---

## 20. Port Management

Default saat ini:

```text
2019
```

Namun port tidak boleh dianggap selalu tersedia.

Contoh:

```text
2019 ❌
2020 ❌
2021 ✅
```

Agent harus benar-benar melakukan `listen()` dan hanya menganggap service aktif setelah berhasil membuka port.

Jika port dapat berubah, website customer membutuhkan mekanisme discovery/configuration.

`/health` harus menginformasikan port aktif.

---

## 21. Localhost Security

Default binding:

```text
127.0.0.1
```

bukan:

```text
0.0.0.0
```

Scanner Agent tidak boleh otomatis menjadi public network service.

---

## 22. Allowed Origins / CORS

Scanner Agent harus menyediakan konfigurasi Allowed Origins.

Contoh:

```text
https://app.customer.com
https://staging.customer.com
```

Konfigurasi existing seperti Selaras dan Perwabkeu tetap harus dapat didukung.

---

## 23. Customer Integration

Customer bebas menggunakan:

```text
React
Vue
Angular
Next.js
Nuxt
Laravel
PHP
Vanilla JavaScript
```

Contoh:

```javascript
const response = await fetch(
  "http://127.0.0.1:2021/health"
);

const data = await response.json();
```

Port harus mengikuti konfigurasi/hasil discovery Agent.

---

## 24. Customer Scanner UI

Platform tidak menyediakan UI scanner yang memaksa semua customer.

Customer dapat membuat:

```text
[ Pilih Scanner ]

[ Scan ]

[ Tambah Halaman ]

[ Hapus ]

[ Generate PDF ]

[ Simpan ]
```

Scanner Agent hanya menyediakan komunikasi dengan scanner.

Business logic seperti:

```text
Nama File
PDF
Preview
Upload
Storage
```

menjadi tanggung jawab customer website.

---

## 25. File Naming

Nama file hasil scan dapat ditentukan oleh customer application.

Contoh:

```text
KTP_Syahroni_2026.pdf
DOCUMENT_20260816_001.pdf
```

Scanner Platform tidak perlu mengambil alih business logic tersebut jika sudah dilakukan oleh website customer.

---

## 26. Version Management

Gunakan:

```text
MAJOR.MINOR.PATCH
```

Contoh:

```text
1.0.0
1.0.1
1.1.0
2.0.0
```

Platform menyimpan:

```text
Version
Release Date
Changelog
Installer
Status
Compatibility
Checksum
```

---

## 27. Existing Application Compatibility

Existing application:

```text
Selaras
Perwabkeu
```

harus tetap berfungsi.

Setiap perubahan pada `service.js` wajib diuji terhadap aplikasi existing.

Jika ada breaking change, gunakan versioning.

---

## 28. Security & Trust

Customer mungkin khawatir bahwa installer `.exe` berisi virus/malware.

Platform harus menyediakan:

- official download source
- publisher information
- version
- changelog
- checksum
- release information

Tahap lanjutan:

- digital code signing
- signature verification
- automatic update

Installer tidak boleh berasal dari arbitrary upload customer.

---

## 29. Logging

Scanner Agent menyediakan log untuk troubleshooting.

Contoh:

```text
INFO  Scanner Agent started
INFO  Port selected: 2021
INFO  Scanner detected
INFO  Scan started
ERROR Scanner device busy
```

---

## 30. Documentation

Platform menyediakan:

```text
Getting Started
Installation
Scanner Agent
API Reference
Health Check
Device Discovery
Scan
Cancel
Port Configuration
CORS / Allowed Origins
Integration Guide
Troubleshooting
Versioning
Security
```

Dokumentasi harus menjelaskan bahwa customer:

1. membuat Scanner Application.
2. download installer.
3. install.
4. menggunakan API dari website mereka.

---

## 31. Domain Model

Minimum:

```text
User
ScannerApplication
ScannerConfiguration
ScannerAgentVersion
Installer
License
```

Relasi:

```text
User
 │
 └── ScannerApplication
        │
        ├── ScannerConfiguration
        ├── Installer
        ├── ScannerAgentVersion
        └── License
```

---

## 32. Platform API

Contoh:

```text
POST   /api/scanners
GET    /api/scanners
GET    /api/scanners/:id
PATCH  /api/scanners/:id
DELETE /api/scanners/:id

GET    /api/scanners/:id/configuration
PATCH  /api/scanners/:id/configuration

GET    /api/scanners/:id/installers

GET    /api/agent-versions
GET    /api/documentation
```

API final mengikuti contract-first workflow dan `SKILL.md`.

---

## 33. State Management

Server state:

```text
TanStack Query
```

URL state:

```text
nuqs / next/navigation
```

Global client state:

```text
Zustand
```

digunakan hanya jika memang diperlukan.

---

## 34. Form Architecture

Form mengikuti standar `SKILL.md`.

Contoh:

```text
src/features/ScannerApplication/
├── model.ts
└── hooks/
    └── useScannerApplicationForm.ts
```

Mutation wajib memberikan success/error feedback dan melakukan invalidation query terkait.

---

## 35. License

License dapat dikaitkan dengan Scanner Application.

Contoh:

```text
Application:
Scanner B

Status:
Active

Expires:
2027-08-16
```

License enforcement lanjutan dapat menjadi tahap berikutnya.

---

## 36. MVP

### Phase 1 — Scanner Agent

```text
✓ Existing service.js
✓ /health
✓ /devices
✓ /scan
✓ /cancel
✓ index.html
✓ Configurable port
✓ Port fallback
✓ Application identity
✓ Logging
✓ Version
✓ Allowed Origins
✓ Windows installer
✓ Automatic start
```

### Phase 2 — Scanner Platform

```text
✓ Authentication
✓ Dashboard
✓ Scanner Application CRUD
✓ Application ID
✓ Configuration
✓ Installer download
✓ Documentation
```

### Phase 3 — Product Management

```text
✓ Version management
✓ Changelog
✓ Checksum
✓ Release management
✓ License
```

### Phase 4 — Advanced

```text
○ Digital signing
○ Automatic update
○ Diagnostics
○ Analytics
○ Advanced license enforcement
```

---

## 37. Development Order

```text
1. Dokumentasikan behavior service.js existing
2. Stabilkan Scanner Agent API
3. Refactor configuration
4. Configurable port
5. Port fallback
6. Application identity
7. Logging
8. index.html
9. Allowed Origins
10. Build official .exe
11. Build official installer
12. Test Selaras
13. Test Perwabkeu
14. Scaffold Next.js Platform
15. Apply SKILL.md
16. Authentication
17. Scanner Application
18. Configuration
19. Installer Distribution
20. Documentation
21. Version Management
22. License
```

---

## 38. Acceptance Criteria — Customer Experience

- [ ] Customer dapat membuat Scanner Application melalui website.
- [ ] Customer tidak perlu menggunakan CMD.
- [ ] Customer tidak perlu install Node.js.
- [ ] Customer tidak perlu menjalankan npm.
- [ ] Customer tidak perlu menjalankan pkg.
- [ ] Customer tidak perlu membuka Inno Setup.
- [ ] Customer mendapatkan installer siap pakai.
- [ ] Customer cukup double click installer.
- [ ] Installer dapat menyelesaikan instalasi.
- [ ] Scanner Agent otomatis berjalan setelah instalasi.
- [ ] Website customer dapat mendeteksi `/health`.
- [ ] Customer dapat menggunakan scanner.

---

## 39. Acceptance Criteria — Scanner Agent

- [ ] `service.js` existing tetap menjadi basis.
- [ ] Scanner Agent berjalan sebagai `.exe`.
- [ ] Agent dapat memilih port tersedia.
- [ ] `/health` berjalan.
- [ ] `/devices` berjalan.
- [ ] `/scan` berjalan.
- [ ] `/cancel` berjalan jika supported.
- [ ] `/` menyediakan tutorial.
- [ ] Version tersedia.
- [ ] Logging tersedia.
- [ ] Allowed Origins tersedia.
- [ ] Selaras tetap berjalan.
- [ ] Perwabkeu tetap berjalan.

---

## 40. Acceptance Criteria — Platform

- [ ] Register/login tersedia.
- [ ] Customer dapat membuat Scanner Application.
- [ ] Application memiliki ID unik.
- [ ] Customer dapat menentukan executable name.
- [ ] Customer dapat mengatur configuration yang diizinkan.
- [ ] Customer dapat download installer.
- [ ] Documentation tersedia.
- [ ] Version tersedia.
- [ ] Dashboard tersedia.

---

## 41. Final Product Flow

### Platform Owner

```text
Develop / maintain service.js
        ↓
Build official Scanner Agent
        ↓
Create release
        ↓
Publish installer
        ↓
Available to customer
```

### Developer / Customer

```text
Login
  ↓
Create Scanner
  ↓
Configure
  ↓
Create
  ↓
Download Installer
```

### End User

```text
Download ScannerB-Setup.exe
        ↓
Double Click
        ↓
Install
        ↓
Finish
        ↓
Agent otomatis berjalan
        ↓
Open Customer Website
        ↓
/health
        ↓
🟢 Ready
```

---

## 42. Core Product Principle

> **Customer tidak membeli source code dan tidak melakukan proses build. Customer membuat Scanner Application di platform, mendapatkan installer resmi, lalu cukup melakukan instalasi seperti aplikasi Windows biasa.**

Target pengalaman produk:

**Create → Download → Install → Use.**
