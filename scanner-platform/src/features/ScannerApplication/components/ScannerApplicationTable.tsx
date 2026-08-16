"use client";

import React from "react";
import Link from "next/link";
import { ScannerApplication } from "@/client/types.gen";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  Trash2,
  Copy,
  Check,
  Building,
  Download,
} from "lucide-react";

interface ScannerApplicationTableProps {
  scanners: ScannerApplication[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export const ScannerApplicationTable: React.FC<ScannerApplicationTableProps> = ({
  scanners,
  onDelete,
  isDeleting,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (scanners.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-900/40 rounded-xl border border-dashed border-slate-800 space-y-3">
        <p className="text-slate-400 text-sm">Belum ada Scanner Application yang terdaftar.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50 shadow-sm">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-950/60 text-xs font-semibold uppercase text-slate-400 tracking-wider border-b border-slate-800">
          <tr>
            <th className="px-5 py-3.5">Application</th>
            <th className="px-5 py-3.5">Application ID</th>
            <th className="px-5 py-3.5">Default Port</th>
            <th className="px-5 py-3.5">Agent Ver</th>
            <th className="px-5 py-3.5">Status</th>
            <th className="px-5 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {scanners.map(app => (
            <tr key={app.id} className="hover:bg-slate-800/30 transition-colors">
              <td className="px-5 py-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-white">{app.name}</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Building className="w-3 h-3 text-slate-500" />
                    {app.companyName}
                  </span>
                </div>
              </td>

              <td className="px-5 py-4">
                <div className="inline-flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 font-mono text-xs text-sky-400">
                  <span>{app.id}</span>
                  <button
                    onClick={() => copyToClipboard(app.id, app.id)}
                    className="text-slate-500 hover:text-white transition-colors"
                    title="Copy Application ID"
                  >
                    {copiedId === app.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </td>

              <td className="px-5 py-4 font-mono text-xs text-slate-200">
                <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {app.configuration?.defaultPort || 2019}
                </span>
              </td>

              <td className="px-5 py-4 font-mono text-xs text-slate-400">
                {app.configuration?.agentVersion || "2.1.0"}
              </td>

              <td className="px-5 py-4">
                <Badge variant={app.status === "active" ? "success" : "warning"}>
                  {app.status.toUpperCase()}
                </Badge>
              </td>

              <td className="px-5 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <a
                    href={`/api/scanners/${app.id}/download`}
                    title="Download Official Installer Package"
                    className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 border border-sky-500/30 transition-colors flex items-center gap-1 text-xs font-semibold px-2.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>

                  <Link href={`/scanners/${app.id}`}>
                    <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Details
                    </Button>
                  </Link>

                  <button
                    onClick={() => {
                      if (confirm(`Hapus aplikasi '${app.name}'? Installer dan lisensi terkait juga akan dihapus.`)) {
                        onDelete(app.id);
                      }
                    }}
                    disabled={isDeleting}
                    title="Delete Application"
                    className="text-slate-500 hover:text-rose-400 p-2 rounded-lg hover:bg-slate-800/80 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
