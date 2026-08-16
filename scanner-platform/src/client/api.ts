import {
  ScannerApplication,
  ScannerConfiguration,
  ScannerAgentVersion,
  InstallerRecord,
  License,
  DashboardStats,
  CreateScannerApplicationDto,
  UpdateScannerApplicationDto,
  UpdateScannerConfigurationDto,
  CreateVersionDto,
  CreateLicenseDto,
  ApiResponse,
  User,
} from "./types.gen";

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const json: ApiResponse<T> = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || "An unexpected error occurred");
  }
  return json.data as T;
}

export const api = {
  auth: {
    login: (body: { email: string; password?: string }) =>
      fetcher<{ user: User; token: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    register: (body: { name: string; email: string; companyName: string }) =>
      fetcher<{ user: User; token: string }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    me: () => fetcher<User>("/api/auth/me"),
    logout: () => fetcher<{ success: boolean }>("/api/auth/logout", { method: "POST" }),
  },

  dashboard: {
    getStats: () => fetcher<DashboardStats>("/api/dashboard/stats"),
  },

  scanners: {
    list: () => fetcher<ScannerApplication[]>("/api/scanners"),
    getById: (id: string) => fetcher<ScannerApplication>(`/api/scanners/${id}`),
    create: (dto: CreateScannerApplicationDto) =>
      fetcher<ScannerApplication>("/api/scanners", {
        method: "POST",
        body: JSON.stringify(dto),
      }),
    update: (id: string, dto: UpdateScannerApplicationDto) =>
      fetcher<ScannerApplication>(`/api/scanners/${id}`, {
        method: "PATCH",
        body: JSON.stringify(dto),
      }),
    delete: (id: string) =>
      fetcher<{ success: boolean }>(`/api/scanners/${id}`, {
        method: "DELETE",
      }),
    getConfig: (id: string) => fetcher<ScannerConfiguration>(`/api/scanners/${id}/configuration`),
    updateConfig: (id: string, dto: UpdateScannerConfigurationDto) =>
      fetcher<ScannerConfiguration>(`/api/scanners/${id}/configuration`, {
        method: "PATCH",
        body: JSON.stringify(dto),
      }),
    getInstaller: (id: string) => fetcher<InstallerRecord>(`/api/scanners/${id}/installers`),
    getLicense: (id: string) => fetcher<License>(`/api/scanners/${id}/license`),
    issueLicense: (id: string, dto: Omit<CreateLicenseDto, "applicationId">) =>
      fetcher<License>(`/api/scanners/${id}/license`, {
        method: "POST",
        body: JSON.stringify(dto),
      }),
  },

  versions: {
    list: () => fetcher<ScannerAgentVersion[]>("/api/agent-versions"),
    create: (dto: CreateVersionDto) =>
      fetcher<ScannerAgentVersion>("/api/agent-versions", {
        method: "POST",
        body: JSON.stringify(dto),
      }),
  },

  licenses: {
    list: () => fetcher<License[]>("/api/licenses"),
  },
};
