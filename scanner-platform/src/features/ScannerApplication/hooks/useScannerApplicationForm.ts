"use client";

import { useState } from "react";
import { useClipboard } from "@/hooks/useClipboard";
import { SCANNER_AGENT_HOST } from "@/lib/config";
import {
  ScannerConfiguration,
  UpdateScannerConfigurationDto,
  CreateLicenseDto,
} from "@/client/types.gen";

interface UseScannerApplicationFormParams {
  configuration?: ScannerConfiguration;
  updateConfig: (dto: UpdateScannerConfigurationDto) => Promise<unknown>;
  renewLicense: (dto: Omit<CreateLicenseDto, "applicationId">) => Promise<unknown>;
}

export function useScannerApplicationForm({
  configuration,
  updateConfig,
  renewLicense,
}: UseScannerApplicationFormParams) {
  const [activeTab, setActiveTab] = useState<"config" | "installer" | "license" | "integration">("config");

  // Config Form Overrides
  const [defaultPortInput, setDefaultPortInput] = useState<string | null>(null);
  const [portRangeEndInput, setPortRangeEndInput] = useState<string | null>(null);
  const [executableNameInput, setExecutableNameInput] = useState<string | null>(null);
  const [installerNameInput, setInstallerNameInput] = useState<string | null>(null);
  const [allowedOriginsInput, setAllowedOriginsInput] = useState<string | null>(null);
  const [agentVersionInput, setAgentVersionInput] = useState<string | null>(null);
  const [enableMockDevInput, setEnableMockDevInput] = useState<boolean | null>(null);

  // Derived effective values
  const defaultPort = defaultPortInput !== null ? Number(defaultPortInput) : configuration?.defaultPort ?? 2019;
  const portRangeEnd = portRangeEndInput !== null ? Number(portRangeEndInput) : configuration?.portRangeEnd ?? 2030;
  const executableName = executableNameInput !== null ? executableNameInput : configuration?.executableName ?? "SelarasScanner.exe";
  const installerName = installerNameInput !== null ? installerNameInput : configuration?.installerName ?? "selaras-scanner-setup.exe";
  const allowedOrigins = allowedOriginsInput !== null ? allowedOriginsInput : (configuration?.allowedOrigins.join(", ") ?? "http://localhost:3000, *");
  const agentVersion = agentVersionInput !== null ? agentVersionInput : configuration?.agentVersion ?? "2.1.0";
  const enableMockDev = enableMockDevInput !== null ? enableMockDevInput : configuration?.enableMockDev ?? false;

  // License Modal State
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [licenseTier, setLicenseTier] = useState<"standard" | "professional" | "enterprise">("professional");
  const [durationMonths, setDurationMonths] = useState(12);
  const [maxInstances, setMaxInstances] = useState(100);

  // Clipboard Hook
  const { copiedId, copy, isCopied } = useClipboard(2000);

  // Live Health Check Test State
  const [testResult, setTestResult] = useState<{ ok: boolean; data?: unknown; error?: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configuration) return;

    await updateConfig({
      defaultPort,
      portRangeStart: defaultPort,
      portRangeEnd,
      executableName,
      installerName,
      agentVersion,
      allowedOrigins: allowedOrigins.split(",").map((s) => s.trim()).filter(Boolean),
      enableMockDev,
    });
  };

  const handleRenewLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    await renewLicense({
      tier: licenseTier,
      durationMonths,
      maxInstances,
    });
    setIsLicenseModalOpen(false);
  };

  const runLocalHealthCheck = async () => {
    setIsTesting(true);
    const targetPort = defaultPort || configuration?.defaultPort || 2019;
    try {
      const res = await fetch(`${SCANNER_AGENT_HOST}:${targetPort}/health`, {
        method: "GET",
        mode: "cors",
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setTestResult({ ok: true, data });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTestResult({
        ok: false,
        error: `Gagal menghubungi Scanner Agent di ${SCANNER_AGENT_HOST}:${targetPort}. Pastikan service sudah dijalankan di komputer ini (${msg}).`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    defaultPort,
    setDefaultPortInput: (val: string) => setDefaultPortInput(val),
    portRangeEnd,
    setPortRangeEndInput: (val: string) => setPortRangeEndInput(val),
    executableName,
    setExecutableNameInput: (val: string) => setExecutableNameInput(val),
    installerName,
    setInstallerNameInput: (val: string) => setInstallerNameInput(val),
    allowedOrigins,
    setAllowedOriginsInput: (val: string) => setAllowedOriginsInput(val),
    agentVersion,
    setAgentVersionInput: (val: string) => setAgentVersionInput(val),
    enableMockDev,
    setEnableMockDevInput: (val: boolean) => setEnableMockDevInput(val),
    isLicenseModalOpen,
    setIsLicenseModalOpen,
    licenseTier,
    setLicenseTier,
    durationMonths,
    setDurationMonths,
    maxInstances,
    setMaxInstances,
    copiedScript: copiedId,
    copyToClipboard: copy,
    isCopied,
    testResult,
    isTesting,
    handleSaveConfig,
    handleRenewLicense,
    runLocalHealthCheck,
  };
}
