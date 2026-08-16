"use client";

import React from "react";
import dayjs from "dayjs";
import { useDiagnostics } from "./hooks/useDiagnostics";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Radio,
  RefreshCw,
  Scan,
  CheckCircle2,
  AlertCircle,
  Clock,
  Terminal,
  StopCircle,
  FileImage,
} from "lucide-react";
import Image from "next/image";

export const DiagnosticsView: React.FC = () => {
  const {
    port,
    setPort,
    isChecking,
    healthStatus,
    healthError,
    pingLatency,
    devices,
    selectedDevice,
    setSelectedDevice,
    isScanning,
    scannedImage,
    scanError,
    checkHealth,
    triggerScan,
    cancelScan,
  } = useDiagnostics();

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Radio className="w-6 h-6 text-emerald-400 animate-pulse" />
            Scanner Agent Live Diagnostics & Testing Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Uji komunikasi localhost{" "}
            <code className="text-sky-300 font-mono">127.0.0.1:[PORT]</code>,
            deteksi perangkat WIA, dan uji coba pemindaian dokumen secara
            real-time.
          </p>
        </div>
      </div>

      {/* Target Port Selector & Health Check */}
      <Card className="border-slate-800 bg-slate-900/50 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <h2 className="text-base font-semibold text-white">
              Localhost Agent Connection
            </h2>
            <p className="text-xs text-slate-400">
              Target host: 127.0.0.1 (Local loopback)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-32">
              <Input
                type="number"
                value={port}
                onChange={(e) => setPort(parseInt(e.target.value, 10) || 2019)}
                placeholder="2019"
              />
            </div>
            <Button
              variant="primary"
              leftIcon={
                <RefreshCw
                  className={`w-4 h-4 ${isChecking ? "animate-spin" : ""}`}
                />
              }
              onClick={() => checkHealth(port)}
              isLoading={isChecking}
            >
              Test Connection
            </Button>
          </div>
        </div>

        {/* Health status visual card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Service Status
            </span>
            <div className="flex items-center gap-2 mt-1">
              {healthStatus ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-base font-bold text-emerald-400">
                    ONLINE & READY
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                  <span className="text-base font-bold text-rose-400">
                    UNREACHABLE
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-xs">
            <span className="text-slate-500 uppercase tracking-wider block font-sans font-semibold">
              Response Time
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-4 h-4 text-sky-400" />
              <span className="text-base font-bold text-white">
                {pingLatency !== null ? `${pingLatency} ms` : "-"}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-xs">
            <span className="text-slate-500 uppercase tracking-wider block font-sans font-semibold">
              Active Identity
            </span>
            <span className="text-slate-200 block text-xs truncate mt-1">
              {healthStatus
                ? `${healthStatus.applicationName || healthStatus.service} (v${healthStatus.version})`
                : "-"}
            </span>
          </div>
        </div>

        {/* Detailed JSON Payload */}
        {healthStatus && (
          <div className="space-y-2">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-4 h-4" />
              GET /health Response Payload
            </span>
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto">
              {JSON.stringify(healthStatus, null, 2)}
            </pre>
          </div>
        )}

        {healthError && (
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/50 text-rose-300 text-xs space-y-1">
            <strong className="block font-semibold">Koneksi Gagal:</strong>
            <p>{healthError}</p>
            <p className="text-rose-400/80 pt-1">
              Tips: Jika service berjalan di port lain (karena port hunting),
              coba ganti port target ke 2020 atau 2021.
            </p>
          </div>
        )}
      </Card>

      {/* Device Discovery & Scan Testing */}
      <Card className="border-slate-800 bg-slate-900/50 space-y-6">
        <div className="pb-4 border-b border-slate-800/80">
          <h2 className="text-base font-semibold text-white">
            WIA Physical Scanner Test Operation
          </h2>
          <p className="text-xs text-slate-400">
            Kirim perintah scan ke scanner fisik dan lihat hasil transfer gambar
            bitmap di browser.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Connected Physical Scanners ({devices.length} Detected)
            </label>
            {devices.length > 0 ? (
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
              >
                {devices.map((d, i) => (
                  <option key={i} value={d.Name}>
                    {d.Name} ({d.DeviceID || "WIA"})
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-500">
                {healthStatus
                  ? "Tidak ada perangkat scanner WIA yang terdeteksi. Hubungkan scanner via USB dan pastikan driver terinstall."
                  : "Hubungkan ke Scanner Agent untuk memuat daftar perangkat."}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              leftIcon={<Scan className="w-4 h-4" />}
              onClick={triggerScan}
              disabled={!healthStatus || devices.length === 0 || isScanning}
              isLoading={isScanning}
            >
              {isScanning ? "Memindai Dokumen..." : "Execute Test Scan"}
            </Button>

            {isScanning && (
              <Button
                variant="danger"
                leftIcon={<StopCircle className="w-4 h-4" />}
                onClick={cancelScan}
              >
                Cancel Scan
              </Button>
            )}
          </div>

          {scanError && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-200">
              {scanError}
            </div>
          )}

          {scannedImage && (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
                <span className="flex items-center gap-1.5">
                  <FileImage className="w-4 h-4" />
                  Hasil Scan Berhasil Diterima (Base64 BMP)
                </span>
                <a
                  href={scannedImage}
                  download={`test_scan_${dayjs().format("YYYYMMDD_HHmmss")}.bmp`}
                  className="text-sky-400 hover:text-sky-300 underline"
                >
                  Download BMP Image
                </a>
              </div>
              <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center p-4">
                <Image
                  src={scannedImage}
                  alt="Scanned Output"
                  className="max-h-96 object-contain rounded shadow-lg"
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
