import React from "react";
import Link from "next/link";
import { Scan } from "lucide-react";

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800/80">
          {/* Brand */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Scan className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-base tracking-tight">
                Scanner<span className="text-sky-400">Platform</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Platform modern manajemen jembatan scanner fisik ke web application dengan standar enterprise, keamanan localhost, dan port hunting otomatis.
            </p>
          </div>

          {/* Nav Column 1 */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Produk & Navigasi
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="#features" className="hover:text-white transition-colors">
                  Fitur Utama
                </Link>
              </li>
              <li>
                <Link href="#architecture" className="hover:text-white transition-colors">
                  Arsitektur Sistem
                </Link>
              </li>
              <li>
                <Link href="/documentation" className="hover:text-white transition-colors">
                  Dokumentasi REST API
                </Link>
              </li>
              <li>
                <Link href="/diagnostics" className="hover:text-white transition-colors">
                  Live Diagnostic Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Column 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Autentikasi & Akun
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Buat Akun Baru
                </Link>
              </li>
              <li>
                <Link href="/scanners" className="hover:text-white transition-colors">
                  Scanner Applications
                </Link>
              </li>
              <li>
                <Link href="/licenses" className="hover:text-white transition-colors">
                  License Management
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; 2026 Scanner Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Windows WIA &bull; TWAIN &bull; SANE Standard</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
