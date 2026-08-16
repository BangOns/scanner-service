export interface AgentHealthResponse {
  success: boolean;
  service: string;
  status: string;
  applicationId?: string;
  applicationName?: string;
  version: string;
  port: number;
  timestamp: string;
}

export interface ScannerDeviceItem {
  DeviceID: string;
  Name: string;
}
