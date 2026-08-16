"use client";

import React from "react";
import Link from "next/link";
import { useDashboardData } from "./hooks/useDashboardData";
import { StatCard } from "./components/StatCard";
import { ActivityFeed } from "./components/ActivityFeed";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Scan,
  CheckCircle2,
  GitBranch,
  ShieldCheck,
  Plus,
  ArrowRight,
  Activity,
  Layers,
  Radio,
} from "lucide-react";

export const DashboardView: React.FC = () => {
  const { stats, applications } = useDashboardData();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-linear-to-r from-slate-900 via-slate-900 to-sky-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Platform Operational
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Scanner Service Hub & Product Management
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Kelola aplikasi scanner, distribusi installer resmi, konfigurasi
            port otomatis, dan monitoring agent hardware Windows.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/diagnostics">
            <Button
              variant="secondary"
              leftIcon={<Radio className="w-4 h-4 text-emerald-400" />}
            >
              Live Diagnostic
            </Button>
          </Link>
          <Link href="/scanners?create=true">
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Create Scanner App
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Applications"
          value={stats?.totalApplications || 0}
          sublabel="Registered scanner bridges"
          icon={<Scan className="w-5 h-5" />}
          color="sky"
          trend={{ text: "Active & Monitored", positive: true }}
        />
        <StatCard
          label="Active Applications"
          value={stats?.activeApplications || 0}
          sublabel="Ready for web integration"
          icon={<CheckCircle2 className="w-5 h-5" />}
          color="emerald"
        />
        <StatCard
          label="Latest Agent Engine"
          value={`v${stats?.latestAgentVersion || "2.1.0"}`}
          sublabel="Multi-port auto hunt supported"
          icon={<GitBranch className="w-5 h-5" />}
          color="indigo"
          trend={{ text: "Stable Release", positive: true }}
        />
        <StatCard
          label="Active Licenses"
          value={stats?.activeLicenses || 0}
          sublabel="Enterprise & Pro tiers"
          icon={<ShieldCheck className="w-5 h-5" />}
          color="amber"
        />
      </div>

      {/* Applications & Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Managed Applications List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">
                Scanner Applications
              </h2>
              <p className="text-xs text-slate-400">
                Aplikasi yang terhubung dengan engine Scanner Agent
              </p>
            </div>
            <Link
              href="/scanners"
              className="text-xs font-medium text-sky-400 hover:text-sky-300 flex items-center gap-1 group"
            >
              View All Scanners
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map((app) => (
              <Card
                key={app.id}
                hoverEffect
                className="flex flex-col justify-between border-slate-800 bg-slate-900/50 relative overflow-hidden group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-sky-300 transition-colors">
                        {app.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        {app.id}
                      </p>
                    </div>
                    <Badge
                      variant={app.status === "active" ? "success" : "warning"}
                    >
                      {app.status.toUpperCase()}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {app.description || "No description provided."}
                  </p>

                  <div className="pt-2 grid grid-cols-2 gap-2 text-xs border-t border-slate-800/60 font-mono">
                    <div className="bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">
                        DEFAULT PORT
                      </span>
                      <span className="text-sky-400 font-semibold">
                        {app.configuration.defaultPort}
                      </span>
                    </div>
                    <div className="bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">
                        AGENT VER
                      </span>
                      <span className="text-slate-200 font-semibold">
                        {app.configuration.agentVersion}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {app.companyName}
                  </span>
                  <Link href={`/scanners/${app.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      rightIcon={<ArrowRight className="w-3 h-3" />}
                    >
                      Manage App
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="space-y-6">
          <Card className="border-slate-800 bg-slate-900/50">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-2">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-400" />
                Recent System Activity
              </h2>
            </div>
            <ActivityFeed activities={stats?.recentActivity || []} />
          </Card>

          {/* Core Principle Callout */}
          <div className="p-5 rounded-xl bg-linear-to-br from-indigo-950/30 to-sky-950/30 border border-sky-800/30 text-xs space-y-3">
            <div className="flex items-center gap-2 font-semibold text-sky-300">
              <Layers className="w-4 h-4" />
              Architecture Principle
            </div>
            <p className="text-slate-300 leading-relaxed">
              <strong>Scanner Platform</strong> mengelola konfigurasi dan
              lisensi, sementara <strong>Scanner Agent (.exe)</strong>{" "}
              menjalankan komunikasi fisik TWAIN/WIA pada{" "}
              <code className="text-sky-300 font-mono">127.0.0.1</code> di PC
              user.
            </p>
            <Link
              href="/documentation"
              className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium"
            >
              Baca Dokumentasi Arsitektur &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
