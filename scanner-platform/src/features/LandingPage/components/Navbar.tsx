"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/store";
import { Scan, Menu, X, ArrowRight, Activity, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const LandingNavbar: React.FC = () => {
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
            <Scan className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-base tracking-tight">Scanner</span>
              <span className="font-semibold text-sky-400 text-base tracking-tight">Platform</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono block -mt-1">v2.1 Enterprise</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link href="#features" className="hover:text-sky-400 transition-colors">
            Fitur Utama
          </Link>
          <Link href="#architecture" className="hover:text-sky-400 transition-colors">
            Arsitektur
          </Link>
          <Link href="#code" className="hover:text-sky-400 transition-colors">
            Integrasi SDK
          </Link>
          <Link href="/documentation" className="flex items-center gap-1 hover:text-sky-400 transition-colors">
            <BookOpen className="w-4 h-4 text-slate-400" />
            Dokumentasi
          </Link>
          <Link href="/diagnostics" className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
            <Activity className="w-4 h-4 text-emerald-400" />
            Live Diagnostic
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Buka Dashboard ({user?.name || "User"})
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Mulai Sekarang
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-900 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-slate-300">
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-900"
            >
              Fitur Utama
            </Link>
            <Link
              href="#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-900"
            >
              Arsitektur
            </Link>
            <Link
              href="#code"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-900"
            >
              Integrasi SDK
            </Link>
            <Link
              href="/documentation"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-900 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              Dokumentasi
            </Link>
            <Link
              href="/diagnostics"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-900 flex items-center gap-2 text-emerald-400"
            >
              <Activity className="w-4 h-4" />
              Live Diagnostic
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full">
                  Buka Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Mulai Sekarang
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
