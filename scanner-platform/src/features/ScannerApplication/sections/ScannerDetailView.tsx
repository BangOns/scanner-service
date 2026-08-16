"use client";

import React from "react";
import { useScannerApplicationDetail } from "../hooks/useScannerApplicationDetail";
import { useScannerApplicationForm } from "../hooks/useScannerApplicationForm";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";
import { InstallerView } from "@/features/Installer";
import {
  Scan,
  Download,
  Settings,
  Activity,
  KeyRound,
  FileCode,
  Copy,
  Check,
  Cpu,
  Globe,
  Terminal,
} from "lucide-react";

interface ScannerDetailViewProps {
  id: string;
}

export const ScannerDetailView: React.FC<ScannerDetailViewProps> = ({ id }) => {
  const {
    application,
    configuration,
    installer,
    license,
    isLoading,
    updateConfig,
    isUpdatingConfig,
    renewLicense,
    isRenewingLicense,
  } = useScannerApplicationDetail(id);

  const {
    activeTab,
    setActiveTab,
    defaultPort,
    setDefaultPortInput,
    portRangeEnd,
    setPortRangeEndInput,
    executableName,
    setExecutableNameInput,
    installerName,
    setInstallerNameInput,
    allowedOrigins,
    setAllowedOriginsInput,
    agentVersion,
    setAgentVersionInput,
    isLicenseModalOpen,
    setIsLicenseModalOpen,
    licenseTier,
    setLicenseTier,
    durationMonths,
    setDurationMonths,
    maxInstances,
    setMaxInstances,
    copiedScript,
    copyToClipboard,
    testResult,
    isTesting,
    handleSaveConfig,
    handleRenewLicense,
    runLocalHealthCheck,
  } = useScannerApplicationForm({
    configuration,
    updateConfig,
    renewLicense,
  });

  if (isLoading || !application) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Scan className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-bold text-white tracking-tight">{application.name}</h1>
                  <Badge variant={application.status === "active" ? "success" : "warning"}>
                    {application.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  ID: <span className="text-sky-400">{application.id}</span> &bull; {application.companyName}
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed mt-2">
              {application.description || "No description provided."}
            </p>
          </div>

          {/* Quick Info Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 font-mono text-xs">
              <span className="text-slate-500 block text-[10px]">LOCAL PORT</span>
              <span className="text-emerald-400 font-bold">127.0.0.1:{configuration?.defaultPort || 2019}</span>
            </div>
            <div className="bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 font-mono text-xs">
              <span className="text-slate-500 block text-[10px]">EXECUTABLE</span>
              <span className="text-slate-200 font-bold">{configuration?.executableName || "Scanner.exe"}</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Activity className="w-4 h-4 text-emerald-400" />}
              onClick={runLocalHealthCheck}
              isLoading={isTesting}
            >
              Test Local Agent
            </Button>
          </div>
        </div>

        {/* Live Test Banner Feedback */}
        {testResult && (
          <div
            className={`mt-4 p-4 rounded-xl border text-xs flex items-start justify-between gap-3 ${
              testResult.ok
                ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-200"
                : "bg-amber-950/40 border-amber-800/60 text-amber-200"
            }`}
          >
            <div>
              <span className="font-bold block mb-1">
                {testResult.ok ? "🟢 Scanner Agent Terhubung!" : "⚠️ Scanner Agent Offline / Belum Terbuka"}
              </span>
              {testResult.ok ? (
                <pre className="font-mono text-[11px] bg-slate-950/60 p-2 rounded border border-emerald-900/50 mt-1">
                  {JSON.stringify(testResult.data, null, 2)}
                </pre>
              ) : (
                <p>{testResult.error}</p>
              )}
            </div>
            <button
              onClick={() => runLocalHealthCheck()}
              className="text-slate-400 hover:text-white text-xs font-semibold"
            >
              Re-test
            </button>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800 space-x-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab("config")}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === "config"
              ? "border-sky-400 text-sky-400 font-semibold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Settings className="w-4 h-4" />
          Agent Configuration
        </button>

        <button
          onClick={() => setActiveTab("installer")}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === "installer"
              ? "border-sky-400 text-sky-400 font-semibold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Download className="w-4 h-4" />
          Installer & Packaging (.iss, .vbs, .bat)
        </button>

        <button
          onClick={() => setActiveTab("license")}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === "license"
              ? "border-sky-400 text-sky-400 font-semibold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <KeyRound className="w-4 h-4" />
          License Management
        </button>

        <button
          onClick={() => setActiveTab("integration")}
          className={`pb-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === "integration"
              ? "border-sky-400 text-sky-400 font-semibold"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileCode className="w-4 h-4" />
          Website Integration Code
        </button>
      </div>

      {/* Tab 1: Agent Configuration */}
      {activeTab === "config" && (
        <Card className="border-slate-800 bg-slate-900/50">
          <form onSubmit={handleSaveConfig} className="space-y-6">
            <div className="border-b border-slate-800/80 pb-4">
              <h3 className="text-base font-semibold text-white">Scanner Agent Network & Identity Settings</h3>
              <p className="text-xs text-slate-400 mt-1">
                Atur identitas file executable, port default, batasan CORS, dan logging untuk aplikasi ini.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Executable Name (.exe)"
                value={executableName || ""}
                onChange={e => setExecutableNameInput(e.target.value)}
                helperText="Nama file binary Windows yang dihasilkan saat build."
                leftIcon={<Terminal className="w-4 h-4" />}
              />

              <Input
                label="Installer File Name"
                value={installerName || ""}
                onChange={e => setInstallerNameInput(e.target.value)}
                helperText="Nama file installer Inno Setup (.exe)."
                leftIcon={<Download className="w-4 h-4" />}
              />

              <Input
                label="Default HTTP Port"
                type="number"
                value={defaultPort || 2019}
                onChange={e => setDefaultPortInput(e.target.value)}
                helperText="Port pertama yang dicoba oleh Scanner Agent saat startup."
                leftIcon={<Cpu className="w-4 h-4" />}
              />

              <Input
                label="Port Range Limit (Fallback Max)"
                type="number"
                value={portRangeEnd || 2030}
                onChange={e => setPortRangeEndInput(e.target.value)}
                helperText="Batas port hunting jika port utama bentrok dengan service lain."
                leftIcon={<Cpu className="w-4 h-4" />}
              />

              <div className="md:col-span-2">
                <Input
                  label="Allowed Origins (CORS)"
                  value={allowedOrigins || ""}
                  onChange={e => setAllowedOriginsInput(e.target.value)}
                  helperText="Daftar URL domain website yang diizinkan mengakses local scanner API (pisahkan koma)."
                  leftIcon={<Globe className="w-4 h-4" />}
                />
              </div>

              <Input
                label="Target Agent Engine Version"
                value={agentVersion || "2.1.0"}
                onChange={e => setAgentVersionInput(e.target.value)}
                helperText="Versi runtime scanner agent yang ditargetkan."
              />
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <Button type="submit" variant="primary" isLoading={isUpdatingConfig}>
                Simpan Konfigurasi
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab 2: Installer & Packaging */}
      {activeTab === "installer" && (
        <InstallerView application={application} installer={installer} />
      )}

      {/* Tab 3: License Management */}
      {activeTab === "license" && (
        <Card className="border-slate-800 bg-slate-900/50 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div>
              <h3 className="text-base font-semibold text-white">Application License Details</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Kunci lisensi resmi untuk otorisasi deployment {application.name}.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<KeyRound className="w-4 h-4" />}
              onClick={() => setIsLicenseModalOpen(true)}
            >
              Issue / Renew License
            </Button>
          </div>

          {license ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">License Key</span>
                <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 font-mono text-sm text-sky-400">
                  <span>{license.licenseKey}</span>
                  <button
                    onClick={() => copyToClipboard(license.licenseKey, "lic_key")}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedScript === "lic_key" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">TIER:</span>
                  <span className="text-slate-200 font-bold uppercase">{license.tier}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">STATUS:</span>
                  <span className="text-emerald-400 font-bold">{license.status.toUpperCase()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">MAX INSTANCES:</span>
                  <span className="text-slate-200">{license.maxInstances} PCs</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">EXPIRES AT:</span>
                  <span className="text-amber-400">{formatDate(license.expiresAt)}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">Belum ada lisensi yang aktif untuk aplikasi ini.</p>
          )}
        </Card>
      )}

      {/* Tab 4: Website Integration Code */}
      {activeTab === "integration" && (
        <Card className="border-slate-800 bg-slate-900/50 space-y-6">
          <div className="pb-4 border-b border-slate-800/80">
            <h3 className="text-base font-semibold text-white">Integrasi ke Website Customer (JavaScript / React)</h3>
            <p className="text-xs text-slate-400 mt-1">
              Gunakan cuplikan kode di bawah ini di website frontend Anda untuk memicu pemindaian dokumen.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                Contoh: React / Next.js / Vanilla JS Scan Handler
              </span>
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`// 1. Cek status Scanner Agent
async function checkScannerHealth() {
  try {
    const res = await fetch("http://127.0.0.1:${configuration?.defaultPort || 2019}/health", {
      method: "GET",
    });
    const data = await res.json();
    console.log("Scanner Agent aktif:", data);
    return data.success;
  } catch (err) {
    console.warn("Scanner Agent belum aktif atau belum di-install!");
    return false;
  }
}

// 2. Ambil daftar scanner fisik yang terhubung
async function getConnectedScanners() {
  const res = await fetch("http://127.0.0.1:${configuration?.defaultPort || 2019}/devices");
  const data = await res.json();
  return data.devices; // [{ DeviceID: "...", Name: "EPSON L385 Series" }]
}

// 3. Jalankan scanning dokumen
async function triggerScan(deviceName) {
  const res = await fetch("http://127.0.0.1:${configuration?.defaultPort || 2019}/scan?deviceName=" + encodeURIComponent(deviceName), {
    method: "POST",
  });
  const data = await res.json();
  if (data.success) {
    // data.image berisi data URL: "data:image/bmp;base64,..."
    return data.image;
  }
  throw new Error(data.error);
}`}
              </pre>
            </div>
          </div>
        </Card>
      )}

      {/* Modal Issue License */}
      <Modal
        isOpen={isLicenseModalOpen}
        onClose={() => setIsLicenseModalOpen(false)}
        title="Issue / Renew Application License"
        description={`Terbitkan lisensi baru atau perbarui lisensi untuk ${application.name}.`}
        maxWidth="md"
      >
        <form onSubmit={handleRenewLicense} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              License Tier
            </label>
            <select
              value={licenseTier}
              onChange={e => setLicenseTier(e.target.value as "standard" | "professional" | "enterprise")}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
            >
              <option value="standard">Standard (Up to 50 PCs)</option>
              <option value="professional">Professional (Up to 100 PCs)</option>
              <option value="enterprise">Enterprise (Unlimited PCs)</option>
            </select>
          </div>

          <Input
            label="Duration (Months)"
            type="number"
            value={durationMonths}
            onChange={e => setDurationMonths(parseInt(e.target.value, 10))}
            helperText="Masa berlaku lisensi sejak diterbitkan."
          />

          <Input
            label="Max Instances / Computers"
            type="number"
            value={maxInstances}
            onChange={e => setMaxInstances(parseInt(e.target.value, 10))}
            helperText="Batas maksimal jumlah komputer user yang dapat menjalankan agent."
          />

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsLicenseModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" isLoading={isRenewingLicense}>
              Terbitkan Lisensi
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
