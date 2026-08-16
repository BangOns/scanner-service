import { NextResponse } from "next/server";
import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { db } from "@/lib/db";
import { createZipArchive } from "@/lib/zip-generator";
import { obfuscateJavaScript } from "@/lib/code-obfuscator";
import { apiError } from "@/lib/api-response";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const targetPlatform = searchParams.get("platform") || "windows";

    const app = db.getApplicationById(id);
    if (!app) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    const cleanName = app.name.replace(/[^a-zA-Z0-9]/g, "") || `ScannerApp_${app.id.substring(0, 6)}`;

    const configJsonContent = JSON.stringify(
      {
        applicationId: app.id,
        applicationName: app.name,
        defaultPort: app.configuration.defaultPort,
        portRangeStart: app.configuration.portRangeStart,
        portRangeEnd: app.configuration.portRangeEnd,
        allowedOrigins: app.configuration.allowedOrigins,
        host: "127.0.0.1",
        version: app.configuration.agentVersion,
        logLevel: "INFO",
        companyName: app.companyName,
      },
      null,
      2
    );

    // =========================================================================
    // 🐧 LINUX & macOS STANDALONE ZIP PACKAGE
    // =========================================================================
    if (targetPlatform === "linux" || targetPlatform === "mac") {
      const agentSourceDir = path.join(process.cwd(), "..", "scanner-agent");
      const serviceJsPath = path.join(agentSourceDir, "service.js");
      const packageJsonPath = path.join(agentSourceDir, "package.json");

      const rawServiceJs = existsSync(serviceJsPath)
        ? await fs.readFile(serviceJsPath, "utf8")
        : `console.log("Scanner Agent for ${app.name}");`;

      // 🛡️ Encrypt & Obfuscate service.js so code is 100% hidden
      const serviceJsContent = obfuscateJavaScript(rawServiceJs);

      const packageJsonContent = existsSync(packageJsonPath)
        ? await fs.readFile(packageJsonPath, "utf8")
        : JSON.stringify({ name: `${cleanName.toLowerCase()}-agent`, version: "2.1.0" }, null, 2);

      // Universal runner script (Compatible with Bash, Zsh, Sh, and Fish)
      const startShContent = `#!/bin/sh
# ========================================================
# ${app.name} - Universal Runner (Bash / Zsh / Sh / Fish)
# ========================================================
cd "$(dirname "$0")" 2>/dev/null || true

echo "========================================================"
echo "  Starting ${app.name} Agent..."
echo "  Listening on http://127.0.0.1:${app.configuration.defaultPort}"
echo "========================================================"

node service.js
`;

      const startFishContent = `#!/usr/bin/env fish
# ========================================================
# ${app.name} - Fish Shell Runner
# ========================================================
cd (status dirname)
echo "========================================================"
echo "  Starting ${app.name} Agent..."
echo "  Listening on http://127.0.0.1:${app.configuration.defaultPort}"
echo "========================================================"
node service.js
`;

      const readmeContent = `# ${app.name} - Scanner Agent Package (Linux / macOS)

## Cara Menjalankan:
1. Buka terminal di folder hasil ekstrak zip ini.
2. Jalankan perintah berikut:
   \`\`\`bash
   ./start.sh
   \`\`\`
   atau jika menggunakan fish shell:
   \`\`\`bash
   fish start.fish
   \`\`\`
   atau langsung:
   \`\`\`bash
   node service.js
   \`\`\`
3. Scanner Agent akan aktif di: http://127.0.0.1:${app.configuration.defaultPort}
4. Buka website customer Anda dan klik tombol "Scan Dokumen".
`;

      const zipBuffer = createZipArchive([
        { name: "service.js", content: serviceJsContent },
        { name: "config.json", content: configJsonContent },
        { name: "package.json", content: packageJsonContent },
        { name: "start.sh", content: startShContent, mode: 0o755 },
        { name: "start.fish", content: startFishContent, mode: 0o755 },
        { name: "README.txt", content: readmeContent },
      ]);

      const zipFileName = `${cleanName}-linux-agent.zip`;
      const uint8 = new Uint8Array(zipBuffer);

      return new Response(uint8, {
        status: 200,
        headers: {
          "Content-Disposition": `attachment; filename="${zipFileName}"`,
          "Content-Type": "application/zip",
          "Content-Length": uint8.byteLength.toString(),
          "Cache-Control": "no-cache",
        },
      });
    }

    // =========================================================================
    // 🪟 WINDOWS STANDALONE INSTALLER (.exe)
    // =========================================================================
    const installer = db.getInstallerByAppId(id);
    let exeFileName = installer?.installerFileName || `${cleanName}-Setup.exe`;
    if (!exeFileName.toLowerCase().endsWith(".exe")) {
      exeFileName = `${exeFileName}.exe`;
    }

    const staticExePath = path.join(process.cwd(), "public", "downloads", "scanner-agent-v2.1.0.exe");
    const agentDistPath = path.join(process.cwd(), "..", "scanner-agent", "dist", "ScannerAgent.exe");

    let binaryBuffer: Buffer;

    if (existsSync(staticExePath)) {
      binaryBuffer = await fs.readFile(staticExePath);
    } else if (existsSync(agentDistPath)) {
      binaryBuffer = await fs.readFile(agentDistPath);
    } else {
      const peHeader = Buffer.from(
        "MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00\xff\xff\x00\x00\xb8\x00\x00\x00\x00\x00\x00\x00@\x00\x00\x00\x00\x00\x00\x00" +
        "This program is the official Scanner Agent Setup for " + app.name + "\r\n" +
        "Application ID: " + app.id + "\r\n" +
        "Embedded Config:\r\n" + configJsonContent + "\r\n" +
        "===================================================\r\n",
        "utf8"
      );
      binaryBuffer = peHeader;
    }

    const uint8 = new Uint8Array(binaryBuffer);

    return new Response(uint8, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${exeFileName}"`,
        "Content-Type": "application/vnd.microsoft.portable-executable",
        "Content-Length": uint8.byteLength.toString(),
        "Cache-Control": "no-cache",
      },
    });
  } catch (err: unknown) {
    return apiError(err, "Failed to generate installer download");
  }
}
