"use client";

import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import { SCANNER_AGENT_HOST, SCANNER_AGENT_DEFAULT_PORT } from "@/lib/config";
import { AgentHealthResponse, ScannerDeviceItem } from "../model";

// function hook untuk mengelola live testing, deteksi perangkat, dan diagnostik scanner agent
export function useDiagnostics() {
  const [port, setPort] = useState<number>(SCANNER_AGENT_DEFAULT_PORT);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [healthStatus, setHealthStatus] = useState<AgentHealthResponse | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [pingLatency, setPingLatency] = useState<number | null>(null);

  // Devices & Scan State
  const [devices, setDevices] = useState<ScannerDeviceItem[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  // function untuk mengambil daftar perangkat hardware scanner yang dicolokkan ke komputer
  const loadDevices = useCallback(async (targetPort: number) => {
    try {
      const res = await fetch(`${SCANNER_AGENT_HOST}:${targetPort}/devices`);
      if (!res.ok) return;
      const data: { success: boolean; devices: ScannerDeviceItem[] } = await res.json();
      if (data.success && Array.isArray(data.devices)) {
        setDevices(data.devices);
        if (data.devices.length > 0) {
          setSelectedDevice(data.devices[0].Name);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // function untuk menguji koneksi (health check) dan mengukur latensi ke scanner agent
  const checkHealth = useCallback(async (targetPort: number = port) => {
    setIsChecking(true);
    setHealthError(null);
    const startMs = dayjs().valueOf();

    try {
      const res = await fetch(`${SCANNER_AGENT_HOST}:${targetPort}/health`, {
        method: "GET",
        mode: "cors",
      });
      const endMs = dayjs().valueOf();
      setPingLatency(Math.round(endMs - startMs));

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data: AgentHealthResponse = await res.json();
      setHealthStatus(data);
      await loadDevices(targetPort);
    } catch (err: unknown) {
      setHealthStatus(null);
      const msg = err instanceof Error ? err.message : String(err);
      setHealthError(
        `Gagal terhubung ke ${SCANNER_AGENT_HOST}:${targetPort}. Pastikan Scanner Agent sedang berjalan di PC ini (${msg}).`
      );
    } finally {
      setIsChecking(false);
    }
  }, [port, loadDevices]);

  // function untuk memicu pemindaian fisik dan menerima gambar hasil scan Base64
  const triggerScan = async () => {
    if (!selectedDevice) return;
    setIsScanning(true);
    setScanError(null);
    setScannedImage(null);

    try {
      const res = await fetch(
        `${SCANNER_AGENT_HOST}:${port}/scan?deviceName=${encodeURIComponent(selectedDevice)}`,
        { method: "POST" }
      );
      if (!res.ok) {
        throw new Error(`Scanner Agent merespon status ${res.status} (${res.statusText})`);
      }
      const data: { success: boolean; image?: string; error?: string } = await res.json();
      if (data.success && data.image) {
        setScannedImage(data.image);
      } else {
        setScanError(data.error || "Gagal memindai dokumen");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setScanError(msg || "Error saat menghubungi Scanner Agent");
    } finally {
      setIsScanning(false);
    }
  };

  // function untuk membatalkan proses scan yang sedang berjalan
  const cancelScan = async () => {
    try {
      await fetch(`${SCANNER_AGENT_HOST}:${port}/cancel`, { method: "POST" });
      setIsScanning(false);
    } catch {
      // ignore
    }
  };

  // function effect untuk auto-probe status agen pada pemuatan awal halaman
  useEffect(() => {
    let isMounted = true;
    const runInitialCheck = async () => {
      if (!isMounted) return;
      await checkHealth(SCANNER_AGENT_DEFAULT_PORT);
    };
    runInitialCheck();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    port,
    setPort,
    isChecking,
    healthStatus,
    healthError,
    pingLatency,
    devices,
    selectedDevice,
    setSelectedDevice,
    isScanning,
    scannedImage,
    scanError,
    checkHealth,
    loadDevices,
    triggerScan,
    cancelScan,
  };
}
