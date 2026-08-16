"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Play, CheckCircle2, RefreshCw, Laptop, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const HeroSection: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const simulateScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult("data:image/bmp;base64,Qk02dQAAAAAAADYAAAAoAAAABAAAAAQAAAABABgAAAAA...[SCAN_IMAGE_BITMAP_BUFFER_OK]");
    }, 1800);
  };

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden border-b border-slate-800/80">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/10 blur-[120px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[250px] bg-indigo-500/10 blur-[100px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>Next-Gen Hybrid Web Scanner Service</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Hubungkan Website Anda ke Mesin Scanner Fisik{" "}
              <span className="text-sky-400">Dalam 3 Baris Kode.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Scanner Platform menyediakan background desktop agent dan web hub terintegrasi untuk mengendalikan scanner USB Canon, Epson, HP, dan Fujitsu langsung dari website bisnis Anda tanpa popup browser yang mengganggu.
            </p>

            {/* Quick Benefits Bullet */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs font-medium text-slate-300 pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Zero-Config Installer (.exe)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Automatic Port Hunting (2019..2030)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Localhost CORS Isolation
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full shadow-lg shadow-sky-500/25 py-3.5 px-7 text-sm font-semibold" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Mulai Buat Scanner App
                </Button>
              </Link>
              <Link href="/diagnostics" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full py-3.5 px-6 text-sm font-semibold" leftIcon={<Laptop className="w-4 h-4 text-emerald-400" />}>
                  Live Diagnostic Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Live REST & Scan Mockup */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
              {/* Window Header */}
              <div className="px-4 py-3 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2">REST API Engine &bull; 127.0.0.1:2019</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ONLINE
                </span>
              </div>

              {/* Code / Request Box */}
              <div className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Website Client Request</span>
                    <span className="text-sky-400">POST /scan</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-200">
                    <span className="text-purple-400">const</span> res = <span className="text-purple-400">await</span> fetch(<span className="text-emerald-300">&quot;http://127.0.0.1:2019/scan&quot;</span>, &#123;
                    <br />
                    &nbsp;&nbsp;method: <span className="text-emerald-300">&quot;POST&quot;</span>,
                    <br />
                    &nbsp;&nbsp;body: JSON.stringify(&#123; device: <span className="text-emerald-300">&quot;EPSON L385&quot;</span> &#125;)
                    <br />
                    &#125;);
                  </div>
                </div>

                {/* Live Trigger Button inside Mockup */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-xs text-slate-400">
                    {isScanning ? "Memproses scanner WIA..." : scanResult ? "Scan selesai 200 OK" : "Coba simulasi request:"}
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={simulateScan}
                    disabled={isScanning}
                    leftIcon={isScanning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  >
                    {isScanning ? "Scanning..." : "Simulate /scan"}
                  </Button>
                </div>

                {/* Output View */}
                <div className="p-3.5 bg-slate-950/90 rounded-xl border border-slate-800 min-h-[90px] flex items-center justify-center">
                  {isScanning ? (
                    <div className="text-center space-y-2 py-3">
                      <RefreshCw className="w-6 h-6 text-sky-400 animate-spin mx-auto" />
                      <p className="text-xs font-mono text-slate-400">Communicating with WIA Device Manager...</p>
                    </div>
                  ) : scanResult ? (
                    <div className="w-full space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-emerald-400 font-semibold">&#10003; 200 OK &bull; Image Captured</span>
                        <span className="text-slate-500">124.5 KB</span>
                      </div>
                      <div className="p-2 bg-slate-900 rounded border border-slate-800 font-mono text-[11px] text-slate-300 truncate">
                        &#123; &quot;success&quot;: true, &quot;image&quot;: &quot;data:image/bmp;base64,...&quot; &#125;
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 text-center">
                      Klik &quot;Simulate /scan&quot; untuk melihat respon Base64 dari local agent.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
