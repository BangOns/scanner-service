import React from "react";

export const CompatibilitySection: React.FC = () => {
  const brands = [
    { name: "Canon", desc: "DR-Series, LiDE, PIXMA" },
    { name: "Epson", desc: "L-Series, DS-Series, Perfection" },
    { name: "HP", desc: "ScanJet Pro, LaserJet MFP" },
    { name: "Fujitsu", desc: "fi-Series, ScanSnap" },
    { name: "Brother", desc: "ADS-Series, DCP-Series" },
    { name: "Xerox", desc: "DocuMate, WorkCentre" },
  ];

  return (
    <section className="py-16 md:py-24 border-b border-slate-800/80 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">
            HARDWARE COMPATIBILITY
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Mendukung Seluruh Merek Scanner Populer
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Kompatibel dengan driver standar Windows WIA 1.0/2.0, TWAIN 2.x, dan protokol SANE di Windows 10, 11, dan Linux.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {brands.map((brand, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1 hover:border-sky-500/40 transition-colors"
            >
              <div className="text-base font-bold text-white tracking-tight">{brand.name}</div>
              <div className="text-[11px] text-slate-500">{brand.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
