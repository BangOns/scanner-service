"use client";

import React, { useState } from "react";
import { InstallerRecord } from "@/client/types.gen";
import { Button } from "@/components/ui/Button";
import { ChevronDown, ChevronUp, FileCode, Terminal, Copy, Check, Info } from "lucide-react";

interface BuildPipelineAccordionProps {
  installer: InstallerRecord;
  onCopyScript: (text: string, label: string) => void;
  copiedScript: string | null;
}

export const BuildPipelineAccordion: React.FC<BuildPipelineAccordionProps> = ({
  installer,
  onCopyScript,
  copiedScript,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-800 rounded-xl bg-slate-900/40 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <FileCode className="w-4 h-4 text-sky-400" />
          <div>
            <span className="text-sm font-semibold text-slate-200">
              Advanced / Internal Support Build Pipeline Scripts
            </span>
            <span className="block text-xs text-slate-500">
              Inno Setup script (.iss), background runner (.vbs), and standalone batch installer (.bat)
            </span>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {isOpen && (
        <div className="p-5 border-t border-slate-800 space-y-6 bg-slate-950/60 animate-in fade-in">
          <div className="p-3 bg-sky-950/20 border border-sky-800/40 rounded-lg text-xs text-sky-300 flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              Script ini hanya untuk kebutuhan advance/custom packaging oleh Platform Developer. Customer umum cukup mendownload file installer resmi di atas.
            </p>
          </div>

          {/* 1. Inno Setup */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileCode className="w-4 h-4" />
                1. Inno Setup Script (.iss)
              </span>
              <Button
                variant="outline"
                size="sm"
                leftIcon={copiedScript === "iss" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                onClick={() => onCopyScript(installer.innoSetupScript, "iss")}
              >
                {copiedScript === "iss" ? "Copied" : "Copy .ISS"}
              </Button>
            </div>
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 max-h-60 overflow-y-auto">
              {installer.innoSetupScript}
            </pre>
          </div>

          {/* 2. VBScript Runner */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileCode className="w-4 h-4" />
                2. Background Runner Script (run.vbs)
              </span>
              <Button
                variant="outline"
                size="sm"
                leftIcon={copiedScript === "vbs" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                onClick={() => onCopyScript(installer.vbsScript, "vbs")}
              >
                {copiedScript === "vbs" ? "Copied" : "Copy run.vbs"}
              </Button>
            </div>
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 max-h-40 overflow-y-auto">
              {installer.vbsScript}
            </pre>
          </div>

          {/* 3. Batch Installer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-4 h-4" />
                3. Standalone Batch Installer (install.bat)
              </span>
              <Button
                variant="outline"
                size="sm"
                leftIcon={copiedScript === "bat" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                onClick={() => onCopyScript(installer.batchScript, "bat")}
              >
                {copiedScript === "bat" ? "Copied" : "Copy install.bat"}
              </Button>
            </div>
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 max-h-60 overflow-y-auto">
              {installer.batchScript}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
