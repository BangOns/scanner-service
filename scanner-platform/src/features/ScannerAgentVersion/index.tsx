"use client";

import React from "react";
import { useScannerAgentVersionManagement } from "./hooks/useScannerAgentVersionManagement";
import { VersionCard } from "./components/VersionCard";
import { ModalCreateVersion } from "./sections/ModalCreateVersion";
import { Button } from "@/components/ui/Button";
import { GitBranch, Plus, RefreshCw } from "lucide-react";

export const ScannerAgentVersionView: React.FC = () => {
  const {
    versions,
    isLoading,
    createVersion,
    isCreating,
    refetch,
    isModalOpen,
    openModal,
    closeModal,
  } = useScannerAgentVersionManagement();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-sky-400" />
            Scanner Agent Versions & Builds
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Riwayat rilis binary Scanner Agent, checksum integritas, dan catatan perubahan (changelog).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />}
            onClick={() => refetch()}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={openModal}
          >
            Release New Version
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="space-y-4">
          {versions.map(v => (
            <VersionCard key={v.id} version={v} />
          ))}
        </div>
      )}

      <ModalCreateVersion
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={createVersion}
        isLoading={isCreating}
      />
    </div>
  );
};
