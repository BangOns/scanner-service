"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/client/api";
import { useClipboard } from "@/hooks/useClipboard";

// function hook untuk mengambil seluruh daftar lisensi aplikasi scanner
export function useLicenses() {
  const { copiedId, copy, isCopied } = useClipboard(2000);

  // function query untuk fetch list lisensi dari backend
  const query = useQuery({
    queryKey: ["licenses", "list"],
    queryFn: () => api.licenses.list(),
  });

  return {
    licenses: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    copiedKey: copiedId,
    copyKey: copy,
    isCopied,
  };
}
