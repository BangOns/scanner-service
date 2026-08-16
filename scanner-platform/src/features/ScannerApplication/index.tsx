"use client";

import React from "react";
import { useScannerApplicationManagement } from "./hooks/useScannerApplicationManagement";
import { ScannerApplicationTable } from "./components/ScannerApplicationTable";
import { ModalCreateScanner } from "./sections/ModalCreateScanner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Search, RefreshCw, ScanLine } from "lucide-react";

export const ScannerApplicationListView: React.FC = () => {
  const {
    scanners,
    isLoading,
    createScanner,
    isCreating,
    deleteScanner,
    isDeleting,
    refetch,
    searchTerm,
    setSearchTerm,
    isModalOpen,
    openModal,
    closeModal,
  } = useScannerApplicationManagement();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ScanLine className="w-6 h-6 text-sky-400" />
            Scanner Applications
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Kelola seluruh aplikasi dan jembatan hardware scanner yang terdaftar di platform.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={openModal}
        >
          Create Scanner App
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search by name, ID, or company..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
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
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full" />
        </div>
      ) : (
        <ScannerApplicationTable
          scanners={scanners}
          onDelete={deleteScanner}
          isDeleting={isDeleting}
        />
      )}

      {/* Create Modal */}
      <ModalCreateScanner
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={createScanner}
        isLoading={isCreating}
      />
    </div>
  );
};
