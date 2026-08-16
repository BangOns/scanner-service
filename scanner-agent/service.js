const { exec } = require("node:child_process");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const process = require("node:process");
const util = require("node:util");

const execPromise = util.promisify(exec);

// ─── 1. Load Configuration ───────────────────────────────────────────────────

const DEFAULT_CONFIG = {
  applicationId: "app_default",
  applicationName: "Scanner Agent",
  version: "2.1.0",
  executableName: "ScannerAgent.exe",
  installerName: "ScannerAgent-Setup.exe",
  defaultPort: 2019,
  portRange: [2019, 2030],
  host: "127.0.0.1",
  allowedOrigins: ["*"],
  logLevel: "INFO",
  logToFile: true,
};

// function untuk memuat konfigurasi dari config.json atau menggunakan nilai default
function loadConfig() {
  const configPath = path.join(__dirname, "config.json");
  if (fs.existsSync(configPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(configPath, "utf8"));
      return { ...DEFAULT_CONFIG, ...data };
    } catch (err) {
      console.warn("Failed to parse config.json, using defaults:", err.message);
    }
  }
  return DEFAULT_CONFIG;
}

const config = loadConfig();
let activePort = config.defaultPort;
let currentScanProcess = null;

// ─── 2. Logging Subsystem ────────────────────────────────────────────────────

// function untuk membuat dan mendapatkan direktori penyimpanan log file
function getLogDir() {
  const base = process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local");
  const dir = path.join(base, "Temp", (config.applicationName || "ScannerAgent").replace(/[^a-zA-Z0-9_-]/g, "_"), "logs");
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (_) {}
  }
  return dir;
}

// function untuk mencatat pesan log ke konsol dan file log lokal
function log(level, message, meta = null) {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` | ${typeof meta === "object" ? JSON.stringify(meta) : meta}` : "";
  const logLine = `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;

  console.log(logLine);

  if (config.logToFile) {
    try {
      const logFile = path.join(getLogDir(), `agent_${new Date().toISOString().slice(0, 10)}.log`);
      fs.appendFileSync(logFile, logLine + "\n", "utf8");
    } catch (_) {}
  }
}

// ─── 3. Helper Functions ──────────────────────────────────────────────────────

// function untuk memvalidasi apakah origin domain web diizinkan mengakses scanner (CORS whitelist)
function checkOriginAllowed(reqOrigin) {
  if (!reqOrigin || !config.allowedOrigins || config.allowedOrigins.includes("*")) {
    return "*";
  }
  if (config.allowedOrigins.includes(reqOrigin)) {
    return reqOrigin;
  }
  // Allow localhost origins by default for local testing
  if (reqOrigin.startsWith("http://localhost:") || reqOrigin.startsWith("http://127.0.0.1:")) {
    return reqOrigin;
  }
  return null;
}

// function untuk mengirim response JSON ke browser lengkap dengan header CORS
function sendJSON(res, req, status, data) {
  const reqOrigin = req ? req.headers.origin : null;
  const allowedOrigin = checkOriginAllowed(reqOrigin) || "*";

  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Allow-Credentials": "true",
  });
  res.end(JSON.stringify(data));
}

// function pembantu untuk menunda eksekusi asinkron (delay/timeout)
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// function untuk mendapatkan folder direktori penampung sementara gambar hasil scan
function getScanOutputDir() {
  const base = process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local");
  const dir = path.join(base, "Temp", (config.applicationName || "ScannerAgent").replace(/[^a-zA-Z0-9_-]/g, "_"));
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

// ─── 4. Device Discovery (WIA) ────────────────────────────────────────────────

// function untuk mendeteksi scanner fisik yang terhubung ke PC via interface WIA
async function getDevices() {
  if (os.platform() !== "win32") {
    log("INFO", "Non-Windows environment detected: returning mock scanner devices for local development.");
    return [
      {
        DeviceID: "{6BDD1FC6-810F-11D0-BEC7-08002BE2092F}\\0000",
        Name: "EPSON L385 Series (WIA Virtual Dev)",
      },
      {
        DeviceID: "{6BDD1FC6-810F-11D0-BEC7-08002BE2092F}\\0001",
        Name: "HP ScanJet Pro 2500 f1 (WIA Virtual Dev)",
      },
    ];
  }

  const psCommand = `powershell -ExecutionPolicy Bypass -Command "$wia = New-Object -ComObject WIA.DeviceManager; $wia.DeviceInfos | Select-Object -Property DeviceID, @{Name='Name';Expression={$_.Properties('Name').Value}} | ConvertTo-Json -Compress"`;
  try {
    const { stdout } = await execPromise(psCommand);
    if (!stdout.trim() || stdout.trim() === "[]") return [];
    const data = JSON.parse(stdout.trim());
    return Array.isArray(data) ? data : [data];
  } catch (err) {
    log("ERROR", "Failed to query WIA devices:", err.message);
    return [];
  }
}

// ─── 5. Scan Process ──────────────────────────────────────────────────────────

// function untuk menjalankan proses scanning dokumen fisik via WIA COM Automation
async function performScan(deviceName) {
  const timestamp = Date.now();
  const fileName = `scan_${timestamp}.bmp`;
  const outputDir = getScanOutputDir();
  const outputPath = path.join(outputDir, fileName);

  log("INFO", `Initiating scan for device: ${deviceName}`);

  // Non-Windows dev fallback: create a 1x1 or sample bitmap file
  if (os.platform() !== "win32") {
    log("INFO", "Non-Windows mock scan generation.");
    // 100x100 simple BMP header + pixel data
    const bmpHeader = Buffer.from([
      0x42, 0x4d, 0x36, 0x75, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x36, 0x00, 0x00, 0x00, 0x28, 0x00,
      0x00, 0x00, 0x64, 0x00, 0x00, 0x00, 0x64, 0x00, 0x00, 0x00, 0x01, 0x00, 0x18, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x75, 0x00, 0x00, 0x12, 0x0b, 0x00, 0x00, 0x12, 0x0b, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    ]);
    const pixels = Buffer.alloc(100 * 100 * 3, 240); // light gray
    fs.writeFileSync(outputPath, Buffer.concat([bmpHeader, pixels]));
    return outputPath;
  }

  const psScriptPath = path.join(outputDir, `scan_script_${timestamp}.ps1`);

  const psScriptContent = `
  $ErrorActionPreference = 'Stop'
  try {
    $deviceManager = New-Object -ComObject WIA.DeviceManager

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

    try {
      $item.Properties.Item('6146').Value = 1
      $item.Properties.Item('6147').Value = 200
      $item.Properties.Item('6148').Value = 200
    } catch {
      Write-Host "Warning: Tidak bisa mengatur resolusi"
    }

    $image = $item.Transfer('{B96B3CAB-0728-11D3-9D7B-0000F81EF32E}')
    $image.SaveFile('${outputPath}')

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

  fs.writeFileSync(psScriptPath, psScriptContent, "utf8");

  try {
    const child = exec(`powershell -ExecutionPolicy Bypass -File "${psScriptPath}"`, { timeout: 90000 });
    currentScanProcess = child;

    const { stdout } = await new Promise((resolve, reject) => {
      let out = "";
      let err = "";
      child.stdout.on("data", d => (out += d));
      child.stderr.on("data", d => (err += d));
      child.on("close", code => {
        currentScanProcess = null;
        if (code === 0) resolve({ stdout: out });
        else reject(new Error(err || out || `Process exited with code ${code}`));
      });
      child.on("error", e => {
        currentScanProcess = null;
        reject(e);
      });
    });

    if (stdout.includes("ERROR:")) {
      throw new Error(stdout.split("ERROR:")[1].trim());
    }

    if (!stdout.includes("SUCCESS")) {
      throw new Error("Scan gagal, tidak ada respon sukses dari scanner.");
    }

    log("INFO", `Scan successful. Output generated at: ${outputPath}`);
    return outputPath;
  } finally {
    if (fs.existsSync(psScriptPath)) {
      try {
        fs.unlinkSync(psScriptPath);
      } catch (_) {}
    }
  }
}

// function untuk membaca file hasil scan setelah proses penulisan file Windows selesai
async function readFileWhenUnlocked(filePath, maxRetries = 20, interval = 500) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const fileHandle = fs.openSync(filePath, "r+");
      fs.closeSync(fileHandle);
      return fs.readFileSync(filePath);
    } catch {
      await sleep(interval);
    }
  }
  throw new Error("File scanner masih dikunci oleh sistem setelah timeout.");
}

// ─── 6. HTML Status Page (GET /) ─────────────────────────────────────────────

// function untuk merender antarmuka web status service agen dalam format HTML (GET /)
function renderRootPage() {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.applicationName} — Service Status</title>
  <style>
    :root {
      --bg: #090d16;
      --card: #131b2e;
      --border: #1e293b;
      --text: #f8fafc;
      --muted: #94a3b8;
      --accent: #38bdf8;
      --success: #22c55e;
      --badge-bg: rgba(34, 197, 94, 0.15);
      --font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font);
      line-height: 1.6;
      display: flex;
      justify-content: center;
      padding: 2rem 1rem;
    }
    .container {
      max-width: 680px;
      width: 100%;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border);
      padding-bottom: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .title-group h1 { font-size: 1.4rem; font-weight: 700; color: #fff; }
    .title-group p { font-size: 0.875rem; color: var(--muted); }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--badge-bg);
      color: var(--success);
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 600;
      border: 1px solid rgba(34, 197, 94, 0.3);
    }
    .pulse {
      width: 8px;
      height: 8px;
      background: var(--success);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--success);
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 1rem;
    }
    .card-label { font-size: 0.75rem; text-transform: uppercase; color: var(--muted); letter-spacing: 0.05em; }
    .card-value { font-size: 1.1rem; font-weight: 600; color: #fff; margin-top: 0.25rem; }
    .section-title { font-size: 0.95rem; font-weight: 600; color: var(--accent); margin-bottom: 0.75rem; }
    .endpoint-list { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
    .endpoint-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(0,0,0,0.2);
      padding: 0.6rem 0.85rem;
      border-radius: 6px;
      font-family: monospace;
      font-size: 0.85rem;
      border: 1px solid var(--border);
    }
    .method-get { color: #38bdf8; font-weight: bold; }
    .method-post { color: #f59e0b; font-weight: bold; }
    .footer {
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border);
      font-size: 0.8rem;
      color: var(--muted);
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title-group">
        <h1>${config.applicationName}</h1>
        <p>Application ID: <code>${config.applicationId}</code></p>
      </div>
      <div class="badge">
        <span class="pulse"></span>
        Running
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <div class="card-label">Version</div>
        <div class="card-value">${config.version}</div>
      </div>
      <div class="card">
        <div class="card-label">Active Port</div>
        <div class="card-value">127.0.0.1:${activePort}</div>
      </div>
      <div class="card">
        <div class="card-label">Executable</div>
        <div class="card-value">${config.executableName}</div>
      </div>
      <div class="card">
        <div class="card-label">Host Binding</div>
        <div class="card-value">127.0.0.1 (Localhost Only)</div>
      </div>
    </div>

    <div style="margin-bottom: 1.5rem;">
      <div class="section-title">Available Local APIs</div>
      <ul class="endpoint-list">
        <li class="endpoint-item">
          <div><span class="method-get">GET</span> /health</div>
          <span style="color:var(--muted)">Check service liveness</span>
        </li>
        <li class="endpoint-item">
          <div><span class="method-get">GET</span> /devices</div>
          <span style="color:var(--muted)">List physical WIA scanners</span>
        </li>
        <li class="endpoint-item">
          <div><span class="method-post">POST</span> /scan</div>
          <span style="color:var(--muted)">Trigger document scan</span>
        </li>
        <li class="endpoint-item">
          <div><span class="method-post">POST</span> /cancel</div>
          <span style="color:var(--muted)">Cancel running scan job</span>
        </li>
        <li class="endpoint-item">
          <div><span class="method-get">GET</span> /config</div>
          <span style="color:var(--muted)">Runtime configuration</span>
        </li>
      </ul>
    </div>

    <div class="footer">
      <span>Scanner Platform Agent &bull; Windows TWAIN / WIA</span>
      <a href="/health" style="color: var(--accent); text-decoration: none;">View /health JSON &rarr;</a>
    </div>
  </div>
</body>
</html>`;
}

// ─── 7. HTTP Request Router ──────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${activePort}`);
  const reqOrigin = req.headers.origin;
  const allowedOrigin = checkOriginAllowed(reqOrigin);

  log("INFO", `${req.method} ${url.pathname}${url.search}`, { origin: reqOrigin });

  // Handle CORS Preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": allowedOrigin || "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
      "Access-Control-Allow-Credentials": "true",
    });
    return res.end();
  }

  // 1. Root Status Page
  if (url.pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(renderRootPage());
  }

  // 2. Health Check
  if (url.pathname === "/health") {
    return sendJSON(res, req, 200, {
      success: true,
      service: "scanner-agent",
      status: "running scanner",
      applicationId: config.applicationId,
      applicationName: config.applicationName,
      version: config.version,
      port: activePort,
      timestamp: new Date().toISOString(),
    });
  }

  // 3. Device Discovery
  if (url.pathname === "/devices") {
    try {
      const devices = await getDevices();
      return sendJSON(res, req, 200, { success: true, devices });
    } catch (err) {
      log("ERROR", "Error in /devices:", err.message);
      return sendJSON(res, req, 500, { success: false, error: err.message });
    }
  }

  // 4. Configuration inspection
  if (url.pathname === "/config") {
    return sendJSON(res, req, 200, {
      success: true,
      applicationId: config.applicationId,
      applicationName: config.applicationName,
      version: config.version,
      executableName: config.executableName,
      activePort,
      allowedOrigins: config.allowedOrigins,
    });
  }

  // 5. Cancel Scan Process
  if (url.pathname === "/cancel" && req.method === "POST") {
    if (currentScanProcess) {
      try {
        currentScanProcess.kill("SIGKILL");
        currentScanProcess = null;
        log("INFO", "Scan process canceled by client request.");
        return sendJSON(res, req, 200, { success: true, message: "Scan canceled successfully" });
      } catch (err) {
        return sendJSON(res, req, 500, { success: false, error: err.message });
      }
    }
    return sendJSON(res, req, 200, { success: true, message: "No active scan job found to cancel" });
  }

  // 6. Scan Execution
  if (url.pathname === "/scan") {
    let deviceName = new URLSearchParams(url.search).get("deviceName");

    // Also support JSON POST body
    if (req.method === "POST" && !deviceName) {
      try {
        const bodyBuffer = await new Promise((resolve, reject) => {
          const chunks = [];
          req.on("data", c => chunks.push(c));
          req.on("end", () => resolve(Buffer.concat(chunks)));
          req.on("error", reject);
        });
        if (bodyBuffer.length > 0) {
          const parsedBody = JSON.parse(bodyBuffer.toString("utf8"));
          deviceName = parsedBody.deviceName;
        }
      } catch (_) {}
    }

    if (!deviceName) {
      return sendJSON(res, req, 400, {
        success: false,
        error: "Parameter deviceName wajib diisi (via query string ?deviceName=... atau JSON body { deviceName: '...' })",
      });
    }

    let filePath;
    try {
      filePath = await performScan(deviceName);
      const buffer = await readFileWhenUnlocked(filePath);
      const base64 = buffer.toString("base64");

      return sendJSON(res, req, 200, {
        success: true,
        image: `data:image/bmp;base64,${base64}`,
        format: "bmp",
        size: buffer.length,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      log("ERROR", `Scan failed for device '${deviceName}':`, err.message);
      return sendJSON(res, req, 500, { success: false, error: err.message });
    } finally {
      if (filePath && fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (_) {}
      }
    }
  }

  sendJSON(res, req, 404, { success: false, error: "Endpoint not found" });
});

// ─── 8. Port Hunting & Server Startup ─────────────────────────────────────────

// function untuk menyalakan HTTP server dengan port hunting otomatis jika port utama sedang digunakan
function startServer(port) {
  const [minPort, maxPort] = config.portRange || [2019, 2030];

  server.removeAllListeners("error");

  server.once("error", (err) => {
    if (err.code === "EADDRINUSE") {
      log("WARN", `Port ${port} is currently in use.`);
      if (port < maxPort) {
        const nextPort = port + 1;
        log("INFO", `Attempting fallback to port ${nextPort}...`);
        startServer(nextPort);
      } else {
        log("ERROR", `Exhausted all ports in range [${minPort} - ${maxPort}]. Service cannot start.`);
        process.exit(1);
      }
    } else {
      log("ERROR", "Unhandled server error:", err);
      process.exit(1);
    }
  });

  server.listen(port, config.host || "127.0.0.1", () => {
    activePort = port;
    log("INFO", `=====================================================`);
    log("INFO", `  ${config.applicationName} v${config.version}`);
    log("INFO", `  Application ID: ${config.applicationId}`);
    log("INFO", `  Running at: http://127.0.0.1:${activePort}`);
    log("INFO", `  Log directory: ${getLogDir()}`);
    log("INFO", `=====================================================`);
  });
}

startServer(config.defaultPort || 2019);

