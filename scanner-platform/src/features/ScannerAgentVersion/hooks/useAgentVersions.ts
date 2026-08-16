"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/client/api";
import { CreateVersionDto } from "@/client/types.gen";
import { useToast } from "@/store";

// function hook untuk mengelola versi rilis scanner agent dan channel rilis
export function useAgentVersions() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // function query untuk mengambil data seluruh versi rilis agent
  const query = useQuery({
    queryKey: ["versions", "list"],
    queryFn: () => api.versions.list(),
  });

  // function mutasi untuk mendaftarkan rilis versi scanner agent baru
  const createMutation = useMutation({
    mutationFn: (dto: CreateVersionDto) => api.versions.create(dto),
    onSuccess: (newVer) => {
      queryClient.invalidateQueries({ queryKey: ["versions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
      showToast(`Scanner Agent v${newVer.version} berhasil dirilis!`, "success");
    },
    onError: (err: Error) => {
      showToast(err.message || "Gagal membuat versi baru", "error");
    },
  });

  return {
    versions: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    createVersion: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    refetch: query.refetch,
  };
}
