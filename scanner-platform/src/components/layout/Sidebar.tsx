"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ScanLine,
  GitBranch,
  KeyRound,
  BookOpen,
  Activity,
  Terminal,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navigation: NavItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      label: "Scanner Apps",
      href: "/scanners",
      icon: <ScanLine className="w-4 h-4" />,
    },
    {
      label: "Agent Versions",
      href: "/versions",
      icon: <GitBranch className="w-4 h-4" />,
    },
    {
      label: "Licenses",
      href: "/licenses",
      icon: <KeyRound className="w-4 h-4" />,
    },
    {
      label: "Live Test & Diagnostics",
      href: "/diagnostics",
      icon: <Activity className="w-4 h-4" />,
      badge: "LIVE",
    },
    {
      label: "API Documentation",
      href: "/documentation",
      icon: <BookOpen className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800/80 bg-slate-950/40 backdrop-blur-md hidden md:flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <div className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase px-3 mb-2">
            Main Management
          </div>
          <nav className="space-y-1">
            {navigation.map(item => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group",
                    isActive
                      ? "bg-sky-500/10 text-sky-400 font-semibold border border-sky-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "transition-colors",
                        isActive ? "text-sky-400" : "text-slate-500 group-hover:text-slate-300"
                      )}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
              Registered Scanners
            </span>
            <Link href="/scanners" className="text-[10px] text-sky-400 hover:underline">
              Semua
            </Link>
          </div>
          <div className="space-y-1">
            <Link
              href="/scanners"
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors",
                pathname === "/scanners"
                  ? "bg-slate-800/80 text-white font-medium"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
              )}
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
                <span>Active Apps Overview</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-between text-slate-300 font-medium">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-sky-400" />
            Scanner Agent
          </span>
          <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-sky-300 font-mono">v2.1.0</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Localhost HTTP bridge binds to <code className="text-slate-300 font-mono">127.0.0.1</code> for security.
        </p>
      </div>
    </aside>
  );
};
