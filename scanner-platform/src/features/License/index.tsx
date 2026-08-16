"use client";

import React from "react";
import Link from "next/link";
import { useLicenses } from "./hooks/useLicenses";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { KeyRound, Copy, Check, ArrowRight, RefreshCw } from "lucide-react";

export const LicenseManagementView: React.FC = () => {
  const { licenses, isLoading, refetch, copiedKey, copyKey } = useLicenses();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <KeyRound className="w-6 h-6 text-sky-400" />
            Scanner Licenses & Entitlements
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manajemen lisensi otorisasi runtime Scanner Agent untuk enterprise
            dan client deployment.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          leftIcon={
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
          }
          onClick={() => refetch()}
        >
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {licenses.map((lic) => (
            <Card
              key={lic.id}
              hoverEffect
              className="border-slate-800 bg-slate-900/50 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-white text-base">
                    {lic.applicationName}
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    App ID: {lic.applicationId}
                  </span>
                </div>
                <Badge
                  variant={lic.status === "active" ? "success" : "warning"}
                >
                  {lic.status.toUpperCase()}
                </Badge>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  License Key
                </span>
                <div className="flex items-center justify-between font-mono text-xs text-sky-400">
                  <span className="truncate">{lic.licenseKey}</span>
                  <button
                    onClick={() => copyKey(lic.licenseKey, lic.id)}
                    className="text-slate-400 hover:text-white p-1"
                    title="Copy License Key"
                  >
                    {copiedKey === lic.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono border-t border-slate-800/60 pt-3">
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] block">TIER</span>
                  <span className="text-slate-200 font-bold uppercase">
                    {lic.tier}
                  </span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] block">
                    INSTANCES
                  </span>
                  <span className="text-slate-200">
                    {lic.currentInstances} / {lic.maxInstances} PCs
                  </span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80 col-span-2">
                  <span className="text-slate-500 text-[10px] block">
                    VALID UNTIL
                  </span>
                  <span className="text-amber-400">
                    {formatDate(lic.expiresAt)}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Link href={`/scanners/${lic.applicationId}`}>
                  <Button
                    variant="secondary"
                    size="sm"
                    rightIcon={<ArrowRight className="w-3 h-3" />}
                  >
                    Manage App License
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
