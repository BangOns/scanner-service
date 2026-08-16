const { exec } = require("node:child_process");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const process = require("node:process");
const util = require("node:util");

const execPromise = util.promisify(exec);
const PORT = 2019;

// ─── Helper ───────────────────────────────────────────────────────────────────

function sendJSON(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Folder output: %USERPROFILE%\AppData\Local\Temp\SelarasScanner
// Lebih aman dari os.tmpdir() karena milik user sendiri, tidak dikunci sistem
function getScanOutputDir() {
  const base
    = process.env.LOCALAPPDATA
      || path.join(os.homedir(), "AppData", "Local");
  const dir = path.join(base, "Temp", "SelarasScanner");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

// ─── 1. Deteksi Perangkat ─────────────────────────────────────────────────────

async function getDevices() {
  const psCommand = `powershell -ExecutionPolicy Bypass -Command "$wia = New-Object -ComObject WIA.DeviceManager; $wia.DeviceInfos | Select-Object -Property DeviceID, @{Name='Name';Expression={$_.Properties('Name').Value}} | ConvertTo-Json -Compress"`;
  try {
    const { stdout } = await execPromise(psCommand);
    if (!stdout.trim() || stdout.trim() === "[]")
      return [];
    const data = JSON.parse(stdout.trim());
    return Array.isArray(data) ? data : [data];
  }
  catch {
    return [];
  }
}

// ─── 2. Proses Scan ───────────────────────────────────────────────────────────

async function performScan(deviceName) {
  const timestamp = Date.now();
  const fileName = `selaras_scan_${timestamp}.bmp`;
  const outputDir = getScanOutputDir();
  const outputPath = path.join(outputDir, fileName);

  // Buat file PowerShell dinamis untuk menghindari masalah multi-line string di CMD
  const psScriptPath = path.join(outputDir, `scan_script_${timestamp}.ps1`);

  const psScriptContent = `
  $ErrorActionPreference = 'Stop'
  try {
    $deviceManager = New-Object -ComObject WIA.DeviceManager

    # Cari device berdasarkan Name
    $deviceInfo = $null
    foreach ($info in $deviceManager.DeviceInfos) {
      if ($info.Type -eq 1 -and $info.Properties.Item('Name').Value -eq '${deviceName.replace(/'/g, "''")}') {
        $deviceInfo = $info
        break
      }
    }

    if ($null -eq $deviceInfo) {
      Write-Output "ERROR: Scanner dengan nama [${deviceName}] tidak ditemukan"
      exit 1
    }

    $device = $deviceInfo.Connect()
    $item = $device.Items.Item(1)

    # Set DPI & Mode Warna menggunakan Property ID (Lebih stabil di semua bahasa OS)
    # 6146 = Current Intent (1=Color, 2=Grayscale, 4=B&W)
    # 6147 = Horizontal Resolution
    # 6148 = Vertical Resolution
    try {
      $item.Properties.Item('6146').Value = 1
      $item.Properties.Item('6147').Value = 200
      $item.Properties.Item('6148').Value = 200
    } catch {
      Write-Host "Warning: Tidak bisa mengatur resolusi"
    }

    # Transfer image & simpan
    $image = $item.Transfer('{B96B3CAB-0728-11D3-9D7B-0000F81EF32E}')
    $image.SaveFile('${outputPath}')

    # ─── PELEPASAN COM OBJECT SECARA TEGAS AGAR FILE TIDAK TERKUNCI ───
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($image) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($item) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($device) | Out-Null
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($deviceManager) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()

    Write-Output "SUCCESS"
  } catch {
    Write-Output "ERROR: $($_.Exception.Message)"
    exit 1
  }
  `;

  // Tulis script ke file sementara
  fs.writeFileSync(psScriptPath, psScriptContent, "utf8");

  try {
    // Eksekusi langsung melalui file .ps1
    const { stdout } = await execPromise(`powershell -ExecutionPolicy Bypass -File "${psScriptPath}"`, { timeout: 60000 });

    if (stdout.includes("ERROR:")) {
      throw new Error(stdout.split("ERROR:")[1].trim());
    }

    if (!stdout.includes("SUCCESS")) {
      throw new Error("Scan gagal, tidak ada respon sukses dari scanner.");
    }

    return outputPath;
  }
  finally {
    // Hapus script sementara agar folder tetap bersih
    if (fs.existsSync(psScriptPath)) {
      try {
        fs.unlinkSync(psScriptPath);
      }
      catch {}
    }
  }
}

// ─── 3. Baca file setelah scan (tunggu sampai tidak terkunci) ─────────────────

async function readFileWhenUnlocked(filePath, maxRetries = 20, interval = 500) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const fileHandle = fs.openSync(filePath, "r+");
      fs.closeSync(fileHandle);
      return fs.readFileSync(filePath);
    }
    catch {
      await sleep(interval);
    }
  }
  throw new Error("File scanner masih dikunci oleh sistem setelah 10 detik.");
}

// ─── 4. Server HTTP ───────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }

  if (url.pathname === "/health") {
    return sendJSON(res, 200, {
      success: true,
      status: "running scanner",
      version: "2.1.0",
    });
  }

  if (url.pathname === "/devices") {
    const devices = await getDevices();
    return sendJSON(res, 200, { success: true, devices });
  }

  // /scan?deviceName=EPSON+L385+Series
  if (url.pathname === "/scan") {
    const deviceName = new URLSearchParams(url.search).get("deviceName");
    if (!deviceName) {
      return sendJSON(res, 400, {
        success: false,
        error: "Parameter deviceName wajib diisi",
      });
    }

    let filePath;
    try {
      filePath = await performScan(deviceName);
      const buffer = await readFileWhenUnlocked(filePath);
      const base64 = buffer.toString("base64");

      return sendJSON(res, 200, {
        success: true,
        image: `data:image/bmp;base64,${base64}`,
        format: "bmp",
        size: buffer.length,
      });
    }
    catch (err) {
      return sendJSON(res, 500, { success: false, error: err.message });
    }
    finally {
      if (filePath && fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        }
        catch {}
      }
    }
  }

  sendJSON(res, 404, { success: false, error: "Not found" });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(
    `Selaras Scanner Service (WIA) berjalan di http://127.0.0.1:${PORT}`,
  );
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} sudah dipakai`);
  }
  else {
    console.error("Server error:", err);
  }
  process.exit(1);
});
