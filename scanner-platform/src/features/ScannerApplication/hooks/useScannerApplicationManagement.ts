"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useScannerApplications } from "./useScannerApplications";

export function useScannerApplicationManagement() {
  const searchParams = useSearchParams();
  const shouldOpenCreate = searchParams?.get("create") === "true";

  const {
    scanners,
    isLoading,
    isError,
    createScanner,
    isCreating,
    deleteScanner,
    isDeleting,
    refetch,
  } = useScannerApplications();

  const [isModalOpen, setIsModalOpen] = useState(shouldOpenCreate);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredScanners = scanners.filter(
    app =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return {
    scanners: filteredScanners,
    rawScanners: scanners,
    isLoading,
    isError,
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
  };
}
