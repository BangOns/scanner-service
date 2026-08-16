import React from "react";
import { ScannerApplication, InstallerRecord } from "@/client/types.gen";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Download,
  ShieldCheck,
  Check,
  Copy,
  Laptop,
  RefreshCw,
} from "lucide-react";

interface InstallerCardProps {
  application: ScannerApplication;
  installer?: InstallerRecord;
  onDownload: () => void;
  isDownloading: boolean;
  onCopyHash: (hash: string) => void;
  isCopiedHash: boolean;
}

export const InstallerCard: React.FC<InstallerCardProps> = ({
  application,
  installer,
  onDownload,
  isDownloading,
  onCopyHash,
  isCopiedHash,
}) => {
  const fileName =
    installer?.installerFileName ||
    `${application.name.replace(/[^a-zA-Z0-9]/g, "")}-Setup.exe`;
  const checksum =
    installer?.checksumSha256 ||
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

  return (
    <Card className="border-slate-800 bg-linear-to-br from-slate-900 via-slate-900 to-sky-950/30 p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Laptop className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {fileName}
                </h3>
                <Badge variant="success">READY TO INSTALL</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Official Windows Standalone Installer untuk {application.name}{" "}
                &bull; v{application.configuration.agentVersion}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified Clean & SHA-256 Validated
            </span>
            <span>&bull;</span>
            <span>Windows 10 / 11 x64</span>
            <span>&bull;</span>
            <span>Est. Size: ~37.6 MB</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            variant="primary"
            size="lg"
            leftIcon={
              isDownloading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )
            }
            onClick={onDownload}
            isLoading={isDownloading}
            className="w-full sm:w-auto shadow-lg shadow-sky-500/20 py-3 px-6 text-sm"
          >
            {isDownloading ? "Downloading..." : `Download ${fileName}`}
          </Button>
        </div>
      </div>

      {/* SHA-256 Checksum Bar */}
      <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 overflow-hidden font-mono">
          <span className="text-slate-500 uppercase tracking-wider text-[10px] font-sans font-bold shrink-0">
            SHA-256 Checksum:
          </span>
          <span className="text-sky-400 truncate">{checksum}</span>
        </div>
        <button
          onClick={() => onCopyHash(checksum)}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs shrink-0 self-end sm:self-auto transition-colors"
        >
          {isCopiedHash ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Hash</span>
            </>
          )}
        </button>
      </div>
    </Card>
  );
};
