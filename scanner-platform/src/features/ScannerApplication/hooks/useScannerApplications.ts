"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/client/api";
import { CreateScannerApplicationDto } from "@/client/types.gen";
import { useToast } from "@/store";

// function hook untuk mengelola state data, pembuatan, dan penghapusan aplikasi scanner
export function useScannerApplications() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // function query untuk mengambil seluruh data list aplikasi scanner dari backend
  const query = useQuery({
    queryKey: ["scanners", "list"],
    queryFn: () => api.scanners.list(),
  });

  // function mutasi untuk menambahkan aplikasi scanner baru ke database
  const createMutation = useMutation({
    mutationFn: (dto: CreateScannerApplicationDto) => api.scanners.create(dto),
    onSuccess: (newApp) => {
      queryClient.invalidateQueries({ queryKey: ["scanners"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
      showToast(`Scanner '${newApp.name}' berhasil dibuat!`, "success");
    },
    onError: (err: Error) => {
      showToast(err.message || "Gagal membuat aplikasi scanner", "error");
    },
  });

  // function mutasi untuk menghapus aplikasi scanner berdasarkan ID
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.scanners.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scanners"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
      showToast("Aplikasi scanner berhasil dihapus", "info");
    },
    onError: (err: Error) => {
      showToast(err.message || "Gagal menghapus aplikasi", "error");
    },
  });

  return {
    scanners: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    createScanner: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteScanner: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    refetch: query.refetch,
  };
}
