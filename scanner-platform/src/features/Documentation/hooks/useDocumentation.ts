"use client";

import { useState } from "react";
import { useClipboard } from "@/hooks/useClipboard";
import { DocumentationSection } from "../model";

export function useDocumentation() {
  const [activeSection, setActiveSection] = useState<DocumentationSection>("overview");
  const { copiedId, copy, isCopied } = useClipboard(2000);

  return {
    activeSection,
    setActiveSection,
    copiedId,
    copyCode: copy,
    isCopied,
  };
}
