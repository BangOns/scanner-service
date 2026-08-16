"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CreateScannerApplicationDto, ScannerApplication } from "@/client/types.gen";
import { Scan, Building2, Globe, Cpu } from "lucide-react";

interface ModalCreateScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateScannerApplicationDto) => Promise<ScannerApplication | void>;
  isLoading: boolean;
}

export const ModalCreateScanner: React.FC<ModalCreateScannerProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [defaultPort, setDefaultPort] = useState(2019);
  const [allowedOrigins, setAllowedOrigins] = useState("http://localhost:3000");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !companyName.trim()) return;

    const cleanName = name.replace(/[^a-zA-Z0-9]/g, "");
    await onSubmit({
      name,
      companyName,
      description,
      defaultPort: Number(defaultPort) || 2019,
      executableName: `${cleanName || "Scanner"}.exe`,
      installerName: `${cleanName || "Scanner"}-Setup.exe`,
      allowedOrigins: allowedOrigins.split(",").map(s => s.trim()).filter(Boolean),
    });

    // Reset form
    setName("");
    setCompanyName("");
    setDescription("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Scanner Application"
      description="Daftarkan aplikasi baru untuk menghasilkan Application ID dan paket installer resmi."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Application Name *"
          placeholder="Contoh: HRIS Scanner / Selaras Scanner"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          leftIcon={<Scan className="w-4 h-4" />}
        />

        <Input
          label="Company / Organization Name *"
          placeholder="Contoh: PT ABC Indonesia"
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
          required
          leftIcon={<Building2 className="w-4 h-4" />}
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Jelaskan kebutuhan scanning untuk sistem atau website ini..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-colors focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Default Port"
            type="number"
            value={defaultPort}
            onChange={e => setDefaultPort(parseInt(e.target.value, 10))}
            helperText="Fallback otomatis jika port bentrok"
            leftIcon={<Cpu className="w-4 h-4" />}
          />

          <Input
            label="Allowed Origins (CORS)"
            placeholder="http://localhost:3000, https://app.com"
            value={allowedOrigins}
            onChange={e => setAllowedOrigins(e.target.value)}
            helperText="Pisahkan dengan koma atau * untuk semua"
            leftIcon={<Globe className="w-4 h-4" />}
          />
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Generate Application & ID
          </Button>
        </div>
      </form>
    </Modal>
  );
};
