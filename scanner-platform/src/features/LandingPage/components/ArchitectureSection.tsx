import React from "react";
import { Globe, Server, Cpu } from "lucide-react";

export const ArchitectureSection: React.FC = () => {
  return (
    <section id="architecture" className="py-20 md:py-28 border-b border-slate-800/80 bg-slate-950/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">
            HYBRID ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Bagaimana Sistem Bekerja Secara Transparan
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Pemisahan tugas yang bersih antara website cloud Anda dan desktop agent lokal memastikan kecepatan maksimal dan privasi data dokumen.
          </p>
        </div>

        {/* 3 Block Architecture Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Box 1: Customer Web App */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Globe className="w-6 h-6" />
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-sky-300">
                  LAYER 01
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Website Aplikasi Anda</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aplikasi bisnis Anda (misal: Selaras, Perwabkeu, SIM-RS) yang diakses oleh pegawai melalui browser Chrome, Edge, atau Firefox.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs font-mono text-slate-300">
              <div className="text-slate-500 text-[11px]">&#47;&#47; Panggil API localhost</div>
              <div className="text-sky-400">POST http://127.0.0.1:2019/scan</div>
            </div>
          </div>

          {/* Box 2: Local Scanner Agent */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-sky-500/40 space-y-4 flex flex-col justify-between shadow-xl shadow-sky-500/5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/30">
                  <Server className="w-6 h-6" />
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                  LAYER 02 (CORE)
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Scanner Agent (.exe)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Background service yang berjalan di PC Windows staf. Mengatur port binding 127.0.0.1, validasi domain CORS, dan komunikasi WIA.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs font-mono text-slate-300">
              <div className="text-slate-500 text-[11px]">&#47;&#47; Driver Interface</div>
              <div className="text-emerald-400">WIA.DeviceManager &bull; 200 DPI</div>
            </div>
          </div>

          {/* Box 3: Physical Scanner Device */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Cpu className="w-6 h-6" />
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                  LAYER 03
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Mesin Scanner Fisik</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Perangkat keras scanner yang terhubung via kabel USB atau jaringan (Epson, Canon, HP, Fujitsu, Brother).
              </p>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs font-mono text-slate-300">
              <div className="text-slate-500 text-[11px]">&#47;&#47; Return Payload</div>
              <div className="text-amber-400">Base64 Bitmap / Raw Stream</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
