"use client";

import { useState } from "react";
import { useClipboard } from "@/hooks/useClipboard";

// function hook untuk mengelola proses unduhan paket installer dan penyalinan checksum
export function useInstaller() {
  const { copiedId, copy, isCopied } = useClipboard(2000);
  const [isDownloading, setIsDownloading] = useState(false);

  // function untuk mengunduh file installer (.exe Windows atau .zip Linux/macOS)
  const downloadInstaller = (appId: string, platform: "windows" | "linux" = "windows") => {
    setIsDownloading(true);
    const safeAppId = encodeURIComponent(appId);
    const safePlatform = encodeURIComponent(platform);
    const link = document.createElement("a");
    link.href = `/api/scanners/${safeAppId}/download?platform=${safePlatform}`;
    link.setAttribute("download", "");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setIsDownloading(false), 1500);
  };

  return {
    copiedScript: copiedId,
    copyToClipboard: copy,
    isCopied,
    isDownloading,
    downloadInstaller,
  };
}
