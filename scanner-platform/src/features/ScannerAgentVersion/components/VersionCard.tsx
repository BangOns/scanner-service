import React from "react";
import { ScannerAgentVersion } from "@/client/types.gen";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate, formatBytes } from "@/lib/utils";
import { Download, ShieldCheck, Check, Copy, Calendar } from "lucide-react";

interface VersionCardProps {
  version: ScannerAgentVersion;
}

export const VersionCard: React.FC<VersionCardProps> = ({ version }) => {
  const [copied, setCopied] = React.useState(false);

  const copyChecksum = () => {
    navigator.clipboard.writeText(version.checksum);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const badgeVariant =
    version.status === "latest"
      ? "success"
      : version.status === "stable"
      ? "info"
      : version.status === "beta"
      ? "warning"
      : "neutral";

  return (
    <Card hoverEffect className="border-slate-800 bg-slate-900/50 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-white tracking-tight">v{version.version}</span>
          <Badge variant={badgeVariant}>{version.status.toUpperCase()}</Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>Released: {formatDate(version.releaseDate)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Changelog & Highlights</span>
        <ul className="space-y-1 text-xs text-slate-300">
          {version.changelog.map((log, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-sky-400 mt-0.5">&bull;</span>
              <span>{log}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-3 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate max-w-[200px] sm:max-w-xs">SHA-256: {version.checksum}</span>
          <button
            onClick={copyChecksum}
            className="text-slate-400 hover:text-white transition-colors"
            title="Copy Checksum"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-slate-500 font-mono text-[11px]">{formatBytes(version.sizeBytes)}</span>
          <Button variant="secondary" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
            Download Package
          </Button>
        </div>
      </div>
    </Card>
  );
};
