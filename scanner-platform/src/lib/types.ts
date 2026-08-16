export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "developer" | "customer";
  companyName: string;
  createdAt: string;
}

export interface ScannerConfiguration {
  id: string;
  applicationId: string;
  executableName: string;
  installerName: string;
  defaultPort: number;
  portRangeStart: number;
  portRangeEnd: number;
  allowedOrigins: string[];
  host: string;
  agentVersion: string;
  logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR";
  logToFile: boolean;
  enableMockDev: boolean;
  updatedAt: string;
}

export interface ScannerApplication {
  id: string;
  name: string;
  companyName: string;
  description: string;
  status: "active" | "inactive" | "maintenance";
  createdAt: string;
  updatedAt: string;
  configuration: ScannerConfiguration;
  licenseId?: string;
}

export interface ScannerAgentVersion {
  id: string;
  version: string;
  releaseDate: string;
  status: "latest" | "stable" | "deprecated" | "beta";
  changelog: string[];
  checksum: string;
  minWindowsVersion: string;
  downloadUrl: string;
  sizeBytes: number;
}

export interface InstallerRecord {
  id: string;
  applicationId: string;
  applicationName: string;
  version: string;
  executableName: string;
  installerFileName: string;
  checksumSha256: string;
  generatedAt: string;
  innoSetupScript: string;
  vbsScript: string;
  batchScript: string;
  configJson: string;
}

export interface License {
  id: string;
  applicationId: string;
  applicationName: string;
  licenseKey: string;
  tier: "standard" | "professional" | "enterprise";
  status: "active" | "expired" | "suspended";
  issuedAt: string;
  expiresAt: string;
  maxInstances: number;
  currentInstances: number;
}

export interface DashboardStats {
  totalApplications: number;
  activeApplications: number;
  inactiveApplications: number;
  latestAgentVersion: string;
  activeLicenses: number;
  totalInstallersGenerated: number;
  recentActivity: Array<{
    id: string;
    action: string;
    entity: string;
    timestamp: string;
    user: string;
  }>;
}
