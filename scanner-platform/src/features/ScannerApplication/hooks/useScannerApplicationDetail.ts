"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/client/api";
import { UpdateScannerApplicationDto, UpdateScannerConfigurationDto, CreateLicenseDto } from "@/client/types.gen";
import { useToast } from "@/store";

// function hook untuk mengambil detail lengkap aplikasi scanner (info, config, installer, lisensi)
export function useScannerApplicationDetail(id: string) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // function query untuk mengambil data info aplikasi scanner
  const appQuery = useQuery({
    queryKey: ["scanners", "detail", id],
    queryFn: () => api.scanners.getById(id),
    enabled: Boolean(id),
  });

  // function query untuk mengambil konfigurasi port & origins aplikasi scanner
  const configQuery = useQuery({
    queryKey: ["scanners", "config", id],
    queryFn: () => api.scanners.getConfig(id),
    enabled: Boolean(id),
  });

  // function query untuk mengambil data installer record aplikasi scanner
  const installerQuery = useQuery({
    queryKey: ["scanners", "installer", id],
    queryFn: () => api.scanners.getInstaller(id),
    enabled: Boolean(id),
  });

  // function query untuk mengambil data lisensi aplikasi scanner
  const licenseQuery = useQuery({
    queryKey: ["scanners", "license", id],
    queryFn: () => api.scanners.getLicense(id),
    enabled: Boolean(id),
  });

  // function mutasi untuk mengupdate data profil aplikasi scanner
  const updateAppMutation = useMutation({
    mutationFn: (dto: UpdateScannerApplicationDto) => api.scanners.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scanners"] });
      showToast("Aplikasi berhasil diperbarui!", "success");
    },
    onError: (err: Error) => {
      showToast(err.message || "Gagal memperbarui aplikasi", "error");
    },
  });

  // function mutasi untuk mengupdate konfigurasi port dan origins aplikasi scanner
  const updateConfigMutation = useMutation({
    mutationFn: (dto: UpdateScannerConfigurationDto) => api.scanners.updateConfig(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scanners", "config", id] });
      queryClient.invalidateQueries({ queryKey: ["scanners", "installer", id] });
      queryClient.invalidateQueries({ queryKey: ["scanners", "detail", id] });
      showToast("Konfigurasi scanner berhasil disimpan!", "success");
    },
    onError: (err: Error) => {
      showToast(err.message || "Gagal menyimpan konfigurasi", "error");
    },
  });

  // function mutasi untuk menerbitkan atau memperbarui lisensi aplikasi scanner
  const renewLicenseMutation = useMutation({
    mutationFn: (dto: Omit<CreateLicenseDto, "applicationId">) => api.scanners.issueLicense(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scanners", "license", id] });
      queryClient.invalidateQueries({ queryKey: ["licenses"] });
      showToast("Lisensi berhasil diterbitkan / diperbarui!", "success");
    },
    onError: (err: Error) => {
      showToast(err.message || "Gagal memperbarui lisensi", "error");
    },
  });

  return {
    application: appQuery.data,
    configuration: configQuery.data,
    installer: installerQuery.data,
    license: licenseQuery.data,
    isLoading: appQuery.isLoading || configQuery.isLoading,
    isError: appQuery.isError,
    updateApp: updateAppMutation.mutateAsync,
    isUpdatingApp: updateAppMutation.isPending,
    updateConfig: updateConfigMutation.mutateAsync,
    isUpdatingConfig: updateConfigMutation.isPending,
    renewLicense: renewLicenseMutation.mutateAsync,
    isRenewingLicense: renewLicenseMutation.isPending,
    refetch: () => {
      appQuery.refetch();
      configQuery.refetch();
      installerQuery.refetch();
      licenseQuery.refetch();
    },
  };
}
