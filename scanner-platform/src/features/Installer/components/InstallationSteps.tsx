import React from "react";
import { Download, MousePointerClick, CheckCircle2, Globe2 } from "lucide-react";

export const InstallationSteps: React.FC = () => {
  const steps = [
    {
      num: "1",
      title: "Download Installer",
      desc: "Klik tombol download di bawah untuk mengunduh official setup package.",
      icon: <Download className="w-5 h-5 text-sky-400" />,
    },
    {
      num: "2",
      title: "Double-Click & Install",
      desc: "Jalankan installer wizard Windows seperti biasa (Next → Install → Finish).",
      icon: <MousePointerClick className="w-5 h-5 text-indigo-400" />,
    },
    {
      num: "3",
      title: "Auto-Start Active",
      desc: "Scanner Agent otomatis aktif di background pada port 127.0.0.1 tanpa konfigurasi.",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    },
    {
      num: "4",
      title: "Siap Scan di Web",
      desc: "Buka website customer (Selaras/Perwabkeu) dan klik tombol 'Scan Dokumen'.",
      icon: <Globe2 className="w-5 h-5 text-amber-400" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {steps.map((step) => (
        <div
          key={step.num}
          className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              {step.icon}
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              STEP 0{step.num}
            </span>
          </div>
          <h4 className="text-sm font-semibold text-white pt-1">{step.title}</h4>
          <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
        </div>
      ))}
    </div>
  );
};
