import React from "react";
import {
  Download,
  Cpu,
  ShieldCheck,
  Code2,
  Sliders,
  Layers,
} from "lucide-react";

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Download className="w-5 h-5 text-sky-400" />,
      title: "1-Click Setup Customer (.exe)",
      description:
        "Pengguna akhir di kantor cukup double-click installer wizard biasa tanpa perlu install Node.js, npm, atau membuka terminal CMD.",
      tag: "Zero Friction",
    },
    {
      icon: <Cpu className="w-5 h-5 text-indigo-400" />,
      title: "Automatic Port Hunting",
      description:
        "Agent secara cerdas mencari port yang bebas mulai dari 2019 hingga 2030 jika port utama digunakan oleh service lain.",
      tag: "Collision Free",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      title: "Localhost Security & CORS Whitelist",
      description:
        "Agent hanya mendengarkan di 127.0.0.1 dan memvalidasi domain website yang diizinkan agar scanner tidak diakses oleh situs asing.",
      tag: "Protected",
    },
    {
      icon: <Code2 className="w-5 h-5 text-amber-400" />,
      title: "Universal Web Compatibility",
      description:
        "Cukup panggil standar HTTP fetch dari React, Vue, Next.js, Angular, Laravel, PHP, maupun script HTML murni.",
      tag: "Any Framework",
    },
    {
      icon: <Sliders className="w-5 h-5 text-rose-400" />,
      title: "Native WIA & TWAIN Hardware Bridge",
      description:
        "Mengontrol scanner USB secara hardware-level: deteksi perangkat otomatis, konfigurasi resolusi DPI, dan transfer bitmap.",
      tag: "Hardware Level",
    },
    {
      icon: <Layers className="w-5 h-5 text-cyan-400" />,
      title: "Centralized Management Hub",
      description:
        "Kelola multi-aplikasi, generate installer otomatis (.iss, .vbs, .bat), kelola lisensi instansi, dan pantau diagnostik live.",
      tag: "All-in-One",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">
            ENGINE CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Dirancang Khusus untuk Solusi Enterprise Dokumen
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Menghilangkan seluruh kerumitan komunikasi perangkat keras scanner di browser web modern dengan arsitektur yang aman dan modular.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900 transition-all space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 group-hover:scale-105 transition-transform">
                  {feature.icon}
                </div>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  {feature.tag}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-white tracking-tight group-hover:text-sky-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
