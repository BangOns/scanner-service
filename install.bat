@echo off
setlocal enabledelayedexpansion
title Selaras Scanner - Installer

:: ─── Cek hak akses Administrator ───────────────────────────────────────────
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo.
    echo  [!] Installer ini membutuhkan hak akses Administrator.
    echo      Klik kanan file ini lalu pilih "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo.
echo  =====================================================
echo    Selaras Scanner Service - Installer v1.1
echo  =====================================================
echo.
echo  Menginstall scanner service...
echo.

:: ─── Variabel ────────────────────────────────────────────────────────────────
set INSTALL_DIR=C:\SelarasApp\scanner
set TASK_NAME=SelarasScanner
set EXE_NAME=SelarasScanner.exe
set SCRIPT_DIR=%~dp0

:: ─── Buat folder instalasi ───────────────────────────────────────────────────
echo  [1/4] Menyiapkan folder instalasi...
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

:: Copy SelarasScanner.exe
if exist "%SCRIPT_DIR%%EXE_NAME%" (
    copy /Y "%SCRIPT_DIR%%EXE_NAME%" "%INSTALL_DIR%\%EXE_NAME%" >nul
    echo      OK: %EXE_NAME% disalin ke %INSTALL_DIR%
) else (
    echo  [!] ERROR: File %EXE_NAME% tidak ditemukan.
    pause
    exit /b 1
)

:: ─── Bersihkan instalasi lama ────────────────────────────────────────────────
echo.
echo  [2/4] Membersihkan instalasi lama...

:: Hapus NSSM service lama kalau ada (migrasi dari versi lama)
sc stop SelarasScanner >nul 2>&1
sc delete SelarasScanner >nul 2>&1

:: Hapus Task Scheduler lama kalau ada
schtasks /delete /tn "%TASK_NAME%" /f >nul 2>&1

echo      OK: Instalasi lama dibersihkan.

:: ─── Daftarkan via Task Scheduler ────────────────────────────────────────────
echo.
echo  [3/4] Mendaftarkan Task Scheduler...

:: Ambil username yang sedang login (bukan SYSTEM)
for /f "tokens=1" %%u in ('whoami') do set CURRENT_USER=%%u

:: Buat scheduled task — jalan saat user login, pakai konteks user aktif
:: /rl highest = jalankan dengan privilege tinggi
:: /sc onlogon = otomatis start saat login
:: /delay = tunggu 10 detik setelah login baru start (pastikan WIA siap)
schtasks /create /tn "%TASK_NAME%" ^
    /tr "\"%INSTALL_DIR%\%EXE_NAME%\"" ^
    /sc onlogon ^
    /rl highest ^
    /delay 0000:10 ^
    /f >nul 2>&1

if %errorLevel% neq 0 (
    echo  [!] ERROR: Gagal mendaftarkan Task Scheduler.
    pause
    exit /b 1
)

echo      OK: Task terdaftar - akan otomatis start saat login.

:: ─── Jalankan sekarang ───────────────────────────────────────────────────────
echo.
echo  [4/4] Menjalankan service...
schtasks /run /tn "%TASK_NAME%" >nul 2>&1
timeout /t 3 /nobreak >nul

:: ─── Verifikasi ──────────────────────────────────────────────────────────────
powershell -NoProfile -Command ^
    "try { $r = Invoke-WebRequest -Uri 'http://localhost:2019/health' -UseBasicParsing -TimeoutSec 5; if ($r.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1

if %errorLevel% equ 0 (
    echo.
    echo  =====================================================
    echo   [OK] Instalasi berhasil!
    echo  =====================================================
    echo.
    echo   Scanner service berjalan di background.
    echo   Otomatis start setiap kali Windows login.
    echo.
    echo   Cek status: http://localhost:2019/health
    echo.
) else (
    echo.
    echo  =====================================================
    echo   [!] Service terinstall tapi belum merespons.
    echo  =====================================================
    echo.
    echo   Kemungkinan butuh beberapa detik lagi.
    echo   Coba buka: http://localhost:2019/health
    echo.
    echo   Jika masih gagal, coba logout lalu login kembali.
    echo.
)

pause
exit /b 0
