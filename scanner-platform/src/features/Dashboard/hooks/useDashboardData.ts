import { useQuery } from "@tanstack/react-query";
import { api } from "@/client/api";

// function hook untuk mengambil data ringkasan dashboard (statistik, aplikasi, dan versi)
export function useDashboardData() {
  // function query untuk mengambil metrik statistik ringkasan
  const statsQuery = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => api.dashboard.getStats(),
  });

  // function query untuk mengambil data daftar aplikasi scanner
  const applicationsQuery = useQuery({
    queryKey: ["scanners", "list"],
    queryFn: () => api.scanners.list(),
  });

  // function query untuk mengambil riwayat rilis versi agent
  const versionsQuery = useQuery({
    queryKey: ["versions", "list"],
    queryFn: () => api.versions.list(),
  });

  return {
    stats: statsQuery.data,
    applications: applicationsQuery.data || [],
    versions: versionsQuery.data || [],
    isLoading: statsQuery.isLoading || applicationsQuery.isLoading,
    isError: statsQuery.isError || applicationsQuery.isError,
    refetch: () => {
      statsQuery.refetch();
      applicationsQuery.refetch();
    },
  };
}
