import {
  User,
  ScannerApplication,
  ScannerConfiguration,
  ScannerAgentVersion,
  InstallerRecord,
  License,
  DashboardStats,
} from "@/lib/types";

export type {
  User,
  ScannerApplication,
  ScannerConfiguration,
  ScannerAgentVersion,
  InstallerRecord,
  License,
  DashboardStats,
};

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CreateScannerApplicationDto {
  name: string;
  companyName: string;
  description: string;
  defaultPort?: number;
  executableName?: string;
  installerName?: string;
  allowedOrigins?: string[];
  agentVersion?: string;
}

export interface UpdateScannerApplicationDto {
  name?: string;
  companyName?: string;
  description?: string;
  status?: "active" | "inactive" | "maintenance";
}

export interface UpdateScannerConfigurationDto {
  executableName?: string;
  installerName?: string;
  defaultPort?: number;
  portRangeStart?: number;
  portRangeEnd?: number;
  allowedOrigins?: string[];
  agentVersion?: string;
  logLevel?: "DEBUG" | "INFO" | "WARN" | "ERROR";
  logToFile?: boolean;
  enableMockDev?: boolean;
}

export interface CreateVersionDto {
  version: string;
  status: "latest" | "stable" | "deprecated" | "beta";
  changelog: string[];
  checksum: string;
  minWindowsVersion?: string;
  downloadUrl?: string;
}

export interface CreateLicenseDto {
  applicationId: string;
  tier: "standard" | "professional" | "enterprise";
  durationMonths: number;
  maxInstances: number;
}
