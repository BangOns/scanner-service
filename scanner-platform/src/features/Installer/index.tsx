"use client";

import React, { useState } from "react";
import { ScannerApplication, InstallerRecord } from "@/client/types.gen";
import { useInstaller } from "./hooks/useInstaller";
import { InstallerCard } from "./components/InstallerCard";
import { InstallationSteps } from "./components/InstallationSteps";
import { BuildPipelineAccordion } from "./components/BuildPipelineAccordion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/store";
import {
  Terminal,
  Download,
  FolderArchive,
  Info,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

interface InstallerViewProps {
  application: ScannerApplication;
  installer?: InstallerRecord;
}

export const InstallerView: React.FC<InstallerViewProps> = ({
  application,
  installer,
}) => {
  const { copiedScript, copyToClipboard, isDownloading, downloadInstaller } =
    useInstaller();
  const { showToast } = useToast();
  const [platformTab, setPlatformTab] = useState<"windows" | "linux">(
    "windows",
  );

  const handleCopyHash = (hash: string) => {
    copyToClipboard(hash, "sha256");
    showToast("Checksum SHA-256 berhasil disalin!", "info");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Target OS Selector */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">
          Target Environment:
        </span>
        <button
          onClick={() => setPlatformTab("windows")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            platformTab === "windows"
              ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          🪟 Windows PC (Customer .exe)
        </button>
        <button
          onClick={() => setPlatformTab("linux")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            platformTab === "linux"
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
              : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
          }`}
        >
          🐧 Linux & macOS (Standalone Package .zip)
        </button>
      </div>

      {platformTab === "windows" ? (
        <>
          {/* 1-Click Main Windows Installer Card */}
          <InstallerCard
            application={application}
            installer={installer}
            onDownload={() => downloadInstaller(application.id, "windows")}
            isDownloading={isDownloading}
            onCopyHash={handleCopyHash}
            isCopiedHash={copiedScript === "sha256"}
          />

          {/* UX 4-Step Visual Flow */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-white">
              Alur Instalasi Customer Windows (Hassle-Free)
            </h3>
            <p className="text-xs text-slate-400">
              Pengguna di PC Windows cukup menjalankan file installer (.exe)
              tanpa perlu membuka terminal CMD atau konfigurasi port.
            </p>
            <InstallationSteps />
          </div>
        </>
      ) : (
        /* Linux / Mac Standalone Package Card */
        <div className="space-y-6">
          <Card className="border-slate-800 bg-linear-to-br from-slate-900 via-slate-900 to-emerald-950/30 p-6 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <FolderArchive className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {application.name.replace(/[^a-zA-Z0-9]/g, "")}
                      -linux-agent.zip
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Standalone Scanner Agent Package untuk Linux & macOS
                      &bull; Port:{" "}
                      {application.configuration.defaultPort || 2019}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Ubuntu / Debian / Fedora / Arch / macOS
                  </span>
                  <span>&bull;</span>
                  <span>Includes: runner, config.json, start.sh</span>
                  <span>&bull;</span>
                  <span>Zero Manual Configuration</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                leftIcon={
                  isDownloading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )
                }
                onClick={() => downloadInstaller(application.id, "linux")}
                isLoading={isDownloading}
                className="bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 py-3 px-6 text-sm shrink-0"
              >
                {isDownloading
                  ? "Downloading..."
                  : "Download Linux Package (.zip)"}
              </Button>
            </div>
          </Card>

          {/* 3 Step Guide for Linux / Mac */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400">
                  <Download className="w-5 h-5" />
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  STEP 1
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white">
                1. Download & Ekstrak .ZIP
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Klik tombol download di atas untuk mengunduh paket zip yang
                sudah terkonfigurasi.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-sky-400">
                  <Terminal className="w-5 h-5" />
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  STEP 2
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white">
                2. Jalankan ./start.sh
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Buka terminal di folder hasil ekstrak lalu jalankan{" "}
                <code className="text-sky-300 font-mono">./start.sh</code>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-amber-400">
                  <Info className="w-5 h-5" />
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  STEP 3
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white">
                3. Buka Website & Scan
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scanner Agent aktif di{" "}
                <code className="text-emerald-300 font-mono">
                  127.0.0.1:{application.configuration.defaultPort || 2019}
                </code>{" "}
                dan website siap memindai!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Collapsible Support Scripts (Internal / Owner only) */}
      {installer && (
        <div className="pt-2">
          <BuildPipelineAccordion
            installer={installer}
            onCopyScript={copyToClipboard}
            copiedScript={copiedScript}
          />
        </div>
      )}
    </div>
  );
};
