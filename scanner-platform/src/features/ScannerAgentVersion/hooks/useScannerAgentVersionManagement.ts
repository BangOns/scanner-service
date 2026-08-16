"use client";

import { useState } from "react";
import { useAgentVersions } from "./useAgentVersions";

export function useScannerAgentVersionManagement() {
  const { versions, isLoading, isError, createVersion, isCreating, refetch } = useAgentVersions();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return {
    versions,
    isLoading,
    isError,
    createVersion,
    isCreating,
    refetch,
    isModalOpen,
    openModal,
    closeModal,
  };
}
