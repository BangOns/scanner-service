"use client";

import React from "react";
import { useDocumentation } from "./hooks/useDocumentation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  BookOpen,
  Code2,
  Terminal,
  Layers,
  HelpCircle,
  Copy,
  Check,
  AlertTriangle,
  Cpu,
} from "lucide-react";

export const DocumentationView: React.FC = () => {
  const { activeSection, setActiveSection, copiedId, copyCode } =
    useDocumentation();

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-sky-400" />
          Scanner Platform & Agent Documentation
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Panduan lengkap integrasi, spesifikasi Localhost REST API, arsitektur
          sistem, dan troubleshooting.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 space-x-6 text-sm font-medium">
        <button
          onClick={() => setActiveSection("overview")}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeSection === "overview"
              ? "border-sky-400 text-sky-400 font-semibold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Layers className="w-4 h-4" />
          Product Architecture
        </button>

        <button
          onClick={() => setActiveSection("api")}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeSection === "api"
              ? "border-sky-400 text-sky-400 font-semibold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Terminal className="w-4 h-4" />
          Agent Localhost API Reference
        </button>

        <button
          onClick={() => setActiveSection("integration")}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeSection === "integration"
              ? "border-sky-400 text-sky-400 font-semibold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Code2 className="w-4 h-4" />
          Customer Website Integration
        </button>

        <button
          onClick={() => setActiveSection("troubleshooting")}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeSection === "troubleshooting"
              ? "border-sky-400 text-sky-400 font-semibold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          Troubleshooting & FAQs
        </button>
      </div>

      {/* Section 1: Overview */}
      {activeSection === "overview" && (
        <div className="space-y-6">
          <Card className="border-slate-800 bg-slate-900/50 space-y-4">
            <h2 className="text-lg font-semibold text-white">
              1. Arsitektur Pemisahan Tanggung Jawab (Core Principle)
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Platform membagi ekosistem scanning menjadi 3 layer terisolasi
              yang saling berkomunikasi:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950 border border-sky-500/30 space-y-2">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                  1. Scanner Platform
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Next.js App Router monolith yang mengelola metadata aplikasi,
                  konfigurasi port, pembuatan script installer (.iss, .vbs,
                  .bat), lisensi, dan dokumentasi.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  2. Scanner Agent (.exe)
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Engine Node.js ringan yang berjalan di komputer Windows klien.
                  Membuka HTTP REST API di{" "}
                  <code className="text-emerald-400 font-mono">
                    127.0.0.1:[PORT]
                  </code>{" "}
                  untuk mengeksekusi perintah scanner WIA/TWAIN secara lokal.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  3. Customer Website
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Aplikasi web (React/Vue/PHP/Laravel/Next) milik klien yang
                  memanggil Localhost HTTP API untuk mendeteksi scanner dan
                  menerima hasil pemindaian base64 image.
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50 space-y-4">
            <h2 className="text-base font-semibold text-white">
              2. Alur Instalasi Klien (End-to-End Installation Flow)
            </h2>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="font-mono text-sky-400 font-bold">Step 1</span>
                <div>
                  <strong className="text-white block">
                    Download Installer Resmi
                  </strong>
                  User mengunduh installer resmi yang dihasilkan dari platform
                  (misal{" "}
                  <code className="text-slate-300">
                    SelarasScanner-Setup.exe
                  </code>
                  ).
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="font-mono text-sky-400 font-bold">Step 2</span>
                <div>
                  <strong className="text-white block">
                    Jalankan Setup di Komputer Windows
                  </strong>
                  Inno Setup menyalin binary ke folder aplikasi dan mendaftarkan
                  Task Scheduler Windows (
                  <code className="text-slate-300">onlogon</code>) via VBScript
                  sehingga service berjalan otomatis di background tanpa popup
                  CMD.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="font-mono text-sky-400 font-bold">Step 3</span>
                <div>
                  <strong className="text-white block">
                    Buka Website & Mulai Memindai
                  </strong>
                  Website frontend klien secara otomatis mendeteksi kehadiran
                  agent melalui{" "}
                  <code className="text-emerald-400 font-mono">
                    GET http://127.0.0.1:2019/health
                  </code>{" "}
                  dan siap memindai dokumen.
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Section 2: API Reference */}
      {activeSection === "api" && (
        <div className="space-y-6">
          {/* GET /health */}
          <Card className="border-slate-800 bg-slate-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="info">GET</Badge>
                <span className="font-mono text-sm text-white font-semibold">
                  /health
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Pemeriksaan status hidup agent
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Digunakan oleh frontend untuk mengecek apakah Scanner Agent aktif
              di komputer pengguna.
            </p>
            <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400">
              {`// Response 200 OK
{
  "success": true,
  "service": "scanner-agent",
  "status": "running scanner",
  "applicationId": "app_selaras_2026",
  "applicationName": "Selaras Scanner",
  "version": "2.1.0",
  "port": 2019,
  "timestamp": "2026-08-16T08:30:00.000Z"
}`}
            </pre>
          </Card>

          {/* GET /devices */}
          <Card className="border-slate-800 bg-slate-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="info">GET</Badge>
                <span className="font-mono text-sm text-white font-semibold">
                  /devices
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Deteksi perangkat scanner fisik
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Mengeksekusi query WIA Device Manager untuk mengambil daftar
              scanner USB/jaringan yang terhubung.
            </p>
            <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400">
              {`// Response 200 OK
{
  "success": true,
  "devices": [
    {
      "DeviceID": "{6BDD1FC6-810F-11D0-BEC7-08002BE2092F}\\\\0000",
      "Name": "EPSON L385 Series"
    }
  ]
}`}
            </pre>
          </Card>

          {/* POST /scan */}
          <Card className="border-slate-800 bg-slate-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="warning">POST</Badge>
                <span className="font-mono text-sm text-white font-semibold">
                  /scan
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Memicu pemindaian dokumen fisik
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Menjalankan scanning dengan device yang dipilih. Menerima query
              param{" "}
              <code className="text-sky-300 font-mono">?deviceName=...</code>{" "}
              atau JSON body{" "}
              <code className="text-sky-300 font-mono">
                {`{ "deviceName": "..." }`}
              </code>
              .
            </p>
            <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400">
              {`// Response 200 OK
{
  "success": true,
  "image": "data:image/bmp;base64,Qk02dQAAAAAA...",
  "format": "bmp",
  "size": 1843254,
  "timestamp": "2026-08-16T08:31:15.000Z"
}`}
            </pre>
          </Card>

          {/* POST /cancel */}
          <Card className="border-slate-800 bg-slate-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="danger">POST</Badge>
                <span className="font-mono text-sm text-white font-semibold">
                  /cancel
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Membatalkan proses pemindaian
              </span>
            </div>
            <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400">
              {`// Response 200 OK
{
  "success": true,
  "message": "Scan canceled successfully"
}`}
            </pre>
          </Card>
        </div>
      )}

      {/* Section 3: Integration Code */}
      {activeSection === "integration" && (
        <div className="space-y-6">
          <Card className="border-slate-800 bg-slate-900/50 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">
                Contoh Kode Integrasi Lengkap (React / TypeScript)
              </h2>
              <Button
                variant="outline"
                size="sm"
                leftIcon={
                  copiedId === "react_snippet" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )
                }
                onClick={() => copyCode(reactCodeSnippet, "react_snippet")}
              >
                {copiedId === "react_snippet" ? "Copied" : "Copy Code"}
              </Button>
            </div>
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-125">
              {reactCodeSnippet}
            </pre>
          </Card>
        </div>
      )}

      {/* Section 4: Troubleshooting */}
      {activeSection === "troubleshooting" && (
        <div className="space-y-4">
          <Card className="border-slate-800 bg-slate-900/50 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
              <AlertTriangle className="w-4 h-4" />
              1. Scanner Agent Belum Aktif / Failed to Fetch di Browser
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Solusi:</strong> Pastikan installer telah dijalankan. Anda
              dapat membuka{" "}
              <code className="text-sky-300 font-mono">
                http://127.0.0.1:2019/
              </code>{" "}
              langsung di browser. Jika port 2019 digunakan aplikasi lain,
              service otomatis berpindah ke port berikutnya (misal 2020 atau
              2021).
            </p>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <AlertTriangle className="w-4 h-4" />
              2. CORS Error pada Website HTTPS Customer
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Solusi:</strong> Masuk ke menu detail aplikasi scanner di
              platform ini, tambahkan domain website Anda (contoh{" "}
              <code className="text-sky-300 font-mono">
                https://app.selaras.id
              </code>
              ) pada kolom <em>Allowed Origins</em>, lalu simpan konfigurasi.
            </p>
          </Card>

          <Card className="border-slate-800 bg-slate-900/50 space-y-2">
            <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
              <Cpu className="w-4 h-4" />
              3. Scanner Device Busy / File Terkunci
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Solusi:</strong> Pada Scanner Agent v2.1.0, kami telah
              menerapkan eksplisit{" "}
              <code className="text-slate-300 font-mono">
                Marshal::ReleaseComObject
              </code>{" "}
              dan garbage collection paksa di akhir setiap proses scan untuk
              memastikan scanner langsung siap dipakai lagi tanpa harus restart
              PC.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};

const reactCodeSnippet = `import React, { useState, useEffect } from "react";

export function ScannerWidget() {
  const [isAgentActive, setIsAgentActive] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scannedImage, setScannedImage] = useState(null);
  const [error, setError] = useState(null);

  const AGENT_BASE = "http://127.0.0.1:2019";

  // 1. Cek status hidup agent saat widget dimuat
  useEffect(() => {
    async function checkAgent() {
      try {
        const res = await fetch(\`\${AGENT_BASE}/health\`);
        const data = await res.json();
        if (data.success) {
          setIsAgentActive(true);
          loadDevices();
        }
      } catch (err) {
        setIsAgentActive(false);
      }
    }
    checkAgent();
  }, []);

  // 2. Ambil daftar scanner yang terhubung
  async function loadDevices() {
    try {
      const res = await fetch(\`\${AGENT_BASE}/devices\`);
      const data = await res.json();
      if (data.success && data.devices.length > 0) {
        setDevices(data.devices);
        setSelectedDevice(data.devices[0].Name);
      }
    } catch (err) {
      console.error("Gagal mengambil perangkat:", err);
    }
  }

  // 3. Eksekusi scan dokumen
  async function handleScan() {
    if (!selectedDevice) return;
    setIsScanning(true);
    setError(null);

    try {
      const res = await fetch(\`\${AGENT_BASE}/scan?deviceName=\${encodeURIComponent(selectedDevice)}\`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setScannedImage(data.image); // data:image/bmp;base64,...
      } else {
        setError(data.error || "Gagal memindai dokumen.");
      }
    } catch (err) {
      setError("Gagal terhubung ke Scanner Agent.");
    } finally {
      setIsScanning(false);
    }
  }

  if (!isAgentActive) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
        ⚠️ <strong>Scanner Agent belum terdeteksi.</strong> Pastikan installer Scanner telah dijalankan di komputer ini.
      </div>
    );
  }

  return (
    <div className="space-y-4 p-5 bg-white border rounded-xl shadow-sm text-slate-800">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base">Pemindai Dokumen Fisik</h3>
        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
          🟢 Agent Aktif
        </span>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase text-slate-500">Pilih Perangkat Scanner</label>
        <select
          value={selectedDevice}
          onChange={(e) => setSelectedDevice(e.target.value)}
          className="w-full p-2.5 border rounded-lg text-sm bg-slate-50"
        >
          {devices.map((d) => (
            <option key={d.DeviceID} value={d.Name}>{d.Name}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleScan}
        disabled={isScanning || !selectedDevice}
        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
      >
        {isScanning ? "Sedang Memindai..." : "Mulai Scan Dokumen"}
      </button>

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

      {scannedImage && (
        <div className="mt-4 space-y-2">
          <span className="text-xs font-semibold text-slate-500">Hasil Pemindaian:</span>
          <img src={scannedImage} alt="Scanned Document" className="w-full max-h-96 object-contain border rounded-lg" />
        </div>
      )}
    </div>
  );
}`;
