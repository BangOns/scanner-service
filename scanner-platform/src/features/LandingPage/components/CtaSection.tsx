import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Activity } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const CtaSection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden border-b border-slate-800/80">
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-sky-950/20 to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Siap Dalam Hitungan Menit</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Mulai Hubungkan Website Anda ke Mesin Scanner Hari Ini
        </h2>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Daftarkan aplikasi scanner Anda, dapatkan installer resmi (.exe), dan
          integrasikan ke aplikasi web Anda tanpa kerumitan.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/register" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full shadow-xl shadow-sky-500/20 py-3.5 px-8 text-sm font-semibold"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Buat Scanner Application
            </Button>
          </Link>
          <Link href="/diagnostics" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              className="w-full py-3.5 px-6 text-sm font-semibold"
              leftIcon={<Activity className="w-4 h-4 text-emerald-400" />}
            >
              Uji Coba Live Diagnostic
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
