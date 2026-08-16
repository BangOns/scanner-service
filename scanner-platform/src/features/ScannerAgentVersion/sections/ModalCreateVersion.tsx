"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CreateVersionDto, ScannerAgentVersion } from "@/client/types.gen";
import { GitBranch } from "lucide-react";

interface ModalCreateVersionProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateVersionDto) => Promise<ScannerAgentVersion | void>;
  isLoading: boolean;
}

export const ModalCreateVersion: React.FC<ModalCreateVersionProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [version, setVersion] = useState("");
  const [status, setStatus] = useState<
    "latest" | "stable" | "deprecated" | "beta"
  >("stable");
  const [changelog, setChangelog] = useState("");
  const [checksum, setChecksum] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!version.trim()) return;

    await onSubmit({
      version,
      status,
      changelog: changelog
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      checksum:
        checksum || `sha256_${Math.random().toString(36).substring(2, 12)}`,
    });

    setVersion("");
    setChangelog("");
    setChecksum("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Release New Scanner Agent Version"
      description="Tambahkan rilisan engine baru dan informasikan pembaruan fitur ke seluruh pengguna."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Version (Semantic) *"
            placeholder="Contoh: 2.2.0"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            required
            leftIcon={<GitBranch className="w-4 h-4" />}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Release Status
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as ScannerAgentVersion["status"])
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
            >
              <option value="latest">Latest (Main Recommendation)</option>
              <option value="stable">Stable</option>
              <option value="beta">Beta / Preview</option>
              <option value="deprecated">Deprecated</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Changelog (Satu item per baris)
          </label>
          <textarea
            rows={4}
            value={changelog}
            onChange={(e) => setChangelog(e.target.value)}
            placeholder="Automatic port fallback on collision&#10;Added WIA Marshal COM cleanup&#10;Allowed Origins support"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5  text-slate-100 placeholder-slate-500 transition-colors focus:outline-none focus:border-sky-500 font-mono text-xs"
          />
        </div>

        <Input
          label="SHA-256 Checksum"
          placeholder="e3b0c44298fc1c149afbf4c8996fb92427ae..."
          value={checksum}
          onChange={(e) => setChecksum(e.target.value)}
          helperText="Checksum integritas binary executable."
        />

        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Rilis Versi
          </Button>
        </div>
      </form>
    </Modal>
  );
};
