# Scanner Agent Engine

Localhost HTTP bridge antara browser web (HTTPS) dan perangkat scanner fisik Windows (WIA / TWAIN) melalui `127.0.0.1:[PORT]`.

## Fitur Utama

- **Automatic Port Hunting & Fallback**: Mencari port tersedia mulai dari default port (misal 2019) sampai range batas atas (misal 2030) jika terjadi port conflict.
- **Localhost Binding Only**: Terikat khusus ke `127.0.0.1` demi keamanan jaringan lokal.
- **Configurable Allowed Origins (CORS)**: Mendukung whitelist origin spesifik dari website klien.
- **Application Identity**: Konfigurasi nama aplikasi, version, applicationId, dan executable name secara dinamis.
- **Enhanced Logging**: Log berformat ISO timestamp dengan file logging otomatis di direktori temp lokal.
- **Interactive Status Root Page (`GET /`)**: Menampilkan status agent, active port, devices, dan daftar endpoint.

## Endpoint API

- `GET /` — Halaman status HTML interaktif
- `GET /health` — Cek status hidup service & metadata
- `GET /devices` — Daftar scanner WIA fisik yang terhubung
- `POST /scan` — Memicu pemindaian dokumen (`?deviceName=...` atau body `{ "deviceName": "..." }`)
- `POST /cancel` — Membatalkan proses scan yang sedang berjalan
- `GET /config` — Menampilkan konfigurasi runtime

## Cara Menjalankan

```bash
# Jalankan agent secara lokal
npm start

# Build menjadi standalone .exe untuk Windows
npm run build
```
