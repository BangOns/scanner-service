"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useClipboard } from "@/hooks/useClipboard";

export const CodePlaygroundSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"js" | "react" | "vue" | "curl">(
    "js",
  );
  const { copy, isCopied } = useClipboard(2000);

  const snippets = {
    js: `// 1. Cek status apakah Scanner Agent aktif di PC user
const healthRes = await fetch("http://127.0.0.1:2019/health");
const { success, port } = await healthRes.json();

// 2. Eksekusi pemindaian dokumen fisik
const scanRes = await fetch("http://127.0.0.1:2019/scan", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ deviceName: "EPSON L385 Series" })
});

const result = await scanRes.json();

// 3. Tampilkan gambar Base64 di halaman web Anda
document.getElementById("scannedImage").src = result.image;`,

    react: `import { useState } from "react";

export function ScannerButton() {
  const [loading, setLoading] = useState(false);
  const [scannedDoc, setScannedDoc] = useState(null);

  const handleScan = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:2019/scan", { method: "POST" });
      const data = await response.json();
      if (data.success) {
        setScannedDoc(data.image);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleScan} disabled={loading}>
        {loading ? "Memindai..." : "Scan Dokumen"}
      </button>
      {scannedDoc && <img src={scannedDoc} alt="Hasil Scan" />}
    </div>
  );
}`,

    vue: `<script setup>
import { ref } from 'vue';

const scannedImage = ref(null);
const isScanning = ref(false);

const startScan = async () => {
  isScanning.value = true;
  try {
    const res = await fetch("http://127.0.0.1:2019/scan", { method: "POST" });
    const data = await res.json();
    if (data.success) {
      scannedImage.value = data.image;
    }
  } finally {
    isScanning.value = false;
  }
};
</script>

<template>
  <div>
    <button @click="startScan" :disabled="isScanning">Scan Dokumen</button>
    <img v-if="scannedImage" :src="scannedImage" alt="Hasil Scan" />
  </div>
</template>`,

    curl: `# 1. Health check status agent
curl -X GET http://127.0.0.1:2019/health

# 2. Ambil daftar scanner yang dicolokkan ke USB
curl -X GET http://127.0.0.1:2019/devices

# 3. Jalankan scan dokumen
curl -X POST http://127.0.0.1:2019/scan \\
  -H "Content-Type: application/json" \\
  -d '{"deviceName": "EPSON L385 Series"}'`,
  };

  const handleCopy = () => {
    copy(snippets[activeTab], activeTab);
  };

  return (
    <section
      id="code"
      className="py-20 md:py-28 border-b border-slate-800/80 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">
            EASY INTEGRATION
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Integrasikan ke Framework Apa Pun dalam Hitungan Menit
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Tidak memerlukan plugin browser NPAPI usang atau dependensi berat.
            Cukup standar REST API yang dikenal oleh setiap web developer.
          </p>
        </div>

        {/* Code Block Container */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
          {/* Tabs Bar */}
          <div className="flex flex-wrap items-center justify-between p-3 bg-slate-950 border-b border-slate-800/80 gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {(
                [
                  { key: "js", label: "Vanilla JavaScript" },
                  { key: "react", label: "React" },
                  { key: "vue", label: "Vue 3" },
                  { key: "curl", label: "cURL" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === tab.key
                      ? "bg-sky-500/10 text-sky-400 border border-sky-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              leftIcon={
                isCopied(activeTab) ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )
              }
              onClick={handleCopy}
              className="text-xs"
            >
              {isCopied(activeTab) ? "Tersalin!" : "Salin Kode"}
            </Button>
          </div>

          {/* Pre Code */}
          <div className="p-5 sm:p-6 bg-slate-950 overflow-x-auto">
            <pre className="font-mono text-xs sm:text-sm text-slate-200 leading-relaxed">
              {snippets[activeTab]}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};
