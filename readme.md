# Scanner Service Documentation & Multi-App Setup Guide

Jembatan (bridge) lokal antara website (HTTPS) dan perangkat scanner fisik (TWAIN/WIA) pada komputer pengguna melalui localhost (`127.0.0.1:2019`).

---

## 📁 Struktur Folder

```text
scanner-service/
├── service.js         # Core service Node.js
├── package.json       # Konfigurasi dependency & build
├── dist/              # Output hasil build (.exe & .vbs)
│   ├── SelarasScanner.exe
│   ├── PerwabkeuScanner.exe
│   ├── run.vbs              # VBScript khusus Selaras
│   └── run-perwabkeu.vbs    # VBScript khusus Perwabkeu
```

Location script Inno Setup (`.iss`):
```text
public/downloads/
├── selaras-scanner.iss
└── perwabkeu-scanner.iss
```

---

## 🛠 Panduan Membuat App/Scanner Baru (Misal: `XyzScanner`)

Jika ada aplikasi/sistem baru yang membutuhkan installer scanner terpisah, ikuti **4 langkah wajib** ini agar installer berjalan lancar tanpa error:

### 1. Build File Executable (.exe) Baru
Jalankan perintah `pkg` dengan nama `.exe` baru:
```bash
npx pkg . --output dist/XyzScanner.exe --compress GZip
```

### 2. Buat File VBS Script Khusus di `dist/`
Buat file `dist/run-xyz.vbs` yang menunjuk ke nama `.exe` baru tersebut:
```vbscript
' run-xyz.vbs
Set WshShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

strFolder = objFSO.GetParentFolderName(WScript.ScriptFullName)
WshShell.CurrentDirectory = strFolder

' PASTIIN NAMA EXE DI SINI SESUAI DENGAN EXE YANG DIBUILD
WshShell.Run chr(34) & strFolder & "\XyzScanner.exe" & Chr(34), 0, False

Set WshShell = Nothing
Set objFSO = Nothing
```

### 3. Buat File Inno Setup Script (`xyz-scanner.iss`)
Duplikasi file `.iss` yang ada (misal `perwabkeu-scanner.iss`), lalu pastikan bagian berikut disesuaikan:

1. **Variabel Nama & AppId Baru**:
   ```iss
   #define MyAppName "xyz-scanner-setup"
   #define MyAppPublisher "Xyz"
   #define MyAppExeName "XyzScanner.exe"

   ; WAJIB Buat AppId / GUID Baru (Di Inno Setup: Tools -> Generate GUID)
   AppId={{GUID-BARU-DI-SINI}
   OutputBaseFilename=xyz-scanner
   ```

2. **Pengaturan [Files] (PENTING ⚠️)**:
   Ambil VBS khusus aplikasi tersebut, namun **rename ke `run.vbs` saat disalin ke komputer target**:
   ```iss
   [Files]
   Source: "D:\kerja\selaras_frontend\scanner-service\dist\{#MyAppExeName}"; DestDir: "{app}"; Flags: ignoreversion
   Source: "D:\kerja\selaras_frontend\scanner-service\dist\run-xyz.vbs"; DestDir: "{app}"; DestName: "run.vbs"; Flags: ignoreversion
   ```

3. **Pengaturan Task Scheduler [Run] & [UninstallRun]**:
   Pastikan Nama Task (`/tn`) dan Nama Process (`/IM`) menggunakan nama unik aplikasi baru:
   ```iss
   [Run]
   Filename: "schtasks"; Parameters: "/delete /tn ""XyzScanner"" /f"; Flags: runhidden; StatusMsg: "Menyiapkan sistem..."
   Filename: "schtasks"; Parameters: "/create /tn ""XyzScanner"" /tr ""wscript.exe """"{app}\run.vbs"""""" /sc onlogon /rl highest /f"; Flags: runhidden; StatusMsg: "Mendaftarkan background service..."
   Filename: "wscript.exe"; Parameters: """{app}\run.vbs"""; Flags: runhidden; StatusMsg: "Menjalankan Xyz Scanner..."

   [UninstallRun]
   Filename: "taskkill"; Parameters: "/F /IM XyzScanner.exe"; Flags: runhidden; RunOnceId: "StopXyzScanner"
   Filename: "schtasks"; Parameters: "/delete /tn ""XyzScanner"" /f"; Flags: runhidden; RunOnceId: "DeleteXyzScannerTask"
   ```

---

## 🚨 Checklist Trouble Shooting & Penyebab Error Umum

| Error / Masalah | Penyebab | Solusi |
| :--- | :--- | :--- |
| **"Cannot find file / File Not Found" saat install selesai** | File VBS yang di-copy di `[Files]` masih memanggil nama `.exe` lama (`SelarasScanner.exe`). | Buat file `run-[app].vbs` baru khusus app tersebut dan gunakan `DestName: "run.vbs"` di bagian `[Files]`. |
| **Icon Installer Error saat Compile** | Path `SetupIconFile` menggunakan lokasi file lokal komputer yang tidak ada / berubah. | Pastikan path `.ico` berada di folder project (misal `public/favicon.ico`). |
| **Scanner lama tertimpa / konflik** | `AppId`, Task Scheduler Name (`/tn`), atau `MyAppName` di file `.iss` sama dengan aplikasi sebelumnya. | Generate `AppId` GUID baru dan gunakan Task Name unik di `[Run]` dan `[UninstallRun]`. |
| **CORS Error di Website** | Domain website belum terdaftar di whitelist scanner. | Tambahkan origin website ke variabel `ALLOWED_ORIGINS` di `service.js` lalu re-build `.exe`. |

---

## 📝 Catatan Maintenance Developer

1. Setiap kali mengubah `service.js`, Anda harus **re-build seluruh file `.exe`** yang berhubungan (`SelarasScanner.exe`, `PerwabkeuScanner.exe`, dll).
2. Setelah re-build `.exe`, re-compile file `.iss` menggunakan Inno Setup (**Ctrl + F9**) untuk memperbarui file installer di `public/downloads/`.
