"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/store";
import { Scan, LogOut, Shield, Radio } from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-linear-to-tr from-sky-600 to-indigo-500 text-white shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                Scanner Platform
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 font-semibold border border-sky-500/20">
                  v2.1
                </span>
              </span>
              <span className="block text-[11px] text-slate-400 -mt-0.5">
                Physical Hardware Bridge & Product Hub
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/diagnostics"
            className="hidden sm:flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Agent Test Console</span>
          </Link>

          {user && (
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <div className="flex flex-col items-end">
                <span className="text-xs font-medium text-slate-200">
                  {user.name}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5 text-sky-400" />
                  {user.companyName}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-semibold">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <button
                onClick={logout}
                title="Logout"
                aria-label="Logout"
                className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
