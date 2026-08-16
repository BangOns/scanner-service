"use client";

import { useState, useCallback } from "react";

// function hook untuk menyalin teks ke clipboard dengan timer otomatis
export function useClipboard(timeout = 2000) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // function untuk mengeksekusi penyalinan teks ke clipboard sistem
  const copy = useCallback(
    (text: string, id = "default") => {
      if (typeof navigator === "undefined" || !navigator.clipboard) {
        return false;
      }
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), timeout);
      return true;
    },
    [timeout]
  );

  // function untuk mengecek apakah ID teks tertentu sedang dalam status tersalin
  const isCopied = (id = "default") => copiedId === id;

  return {
    copiedId,
    copy,
    isCopied,
  };
}
