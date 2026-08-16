import fs from "fs";
import path from "path";
import dayjs from "dayjs";
import {
  User,
  ScannerApplication,
  ScannerConfiguration,
  ScannerAgentVersion,
  InstallerRecord,
  License,
  DashboardStats,
} from "./types";
import {
  generateInnoSetupScript,
  generateVbsScript,
  generateBatchInstaller,
  generateAgentConfigFile,
  generateSha256,
} from "./installer-generator";

interface DatabaseSchema {
  users: User[];
  applications: ScannerApplication[];
  agentVersions: ScannerAgentVersion[];
  installers: InstallerRecord[];
  licenses: License[];
  activityLogs: Array<{
    id: string;
    action: string;
    entity: string;
    timestamp: string;
    user: string;
  }>;
}

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "scanner_platform_db.json");

function getInitialData(): DatabaseSchema {
  const selarasApp: ScannerApplication = {
    id: "app_selaras_2026",
    name: "Selaras Scanner",
    companyName: "PT Selaras Teknologi Mandiri",
    description: "Jembatan scanner dokumen fisik untuk aplikasi web Selaras.",
    status: "active",
    createdAt: "2026-01-15T08:00:00.000Z",
    updatedAt: "2026-08-16T08:00:00.000Z",
    licenseId: "lic_selaras_ent",
    configuration: {
      id: "cfg_selaras_2026",
      applicationId: "app_selaras_2026",
      executableName: "SelarasScanner.exe",
      installerName: "selaras-scanner-setup.exe",
      defaultPort: 2019,
      portRangeStart: 2019,
      portRangeEnd: 2030,
      allowedOrigins: [
        "http://localhost:3000",
        "https://selaras.app",
        "https://app.selaras.id",
      ],
      host: "127.0.0.1",
      agentVersion: "2.1.0",
      logLevel: "INFO",
      logToFile: true,
      enableMockDev: false,
      updatedAt: "2026-08-16T08:00:00.000Z",
    },
  };

  const perwabkeuApp: ScannerApplication = {
    id: "app_perwabkeu_2026",
    name: "Perwabkeu Scanner",
    companyName: "Sistem Administrasi Perwabkeu",
    description: "Integrasi pemindaian bukti transaksi & kuitansi perwabkeu.",
    status: "active",
    createdAt: "2026-02-10T10:30:00.000Z",
    updatedAt: "2026-08-16T08:00:00.000Z",
    licenseId: "lic_perwabkeu_pro",
    configuration: {
      id: "cfg_perwabkeu_2026",
      applicationId: "app_perwabkeu_2026",
      executableName: "PerwabkeuScanner.exe",
      installerName: "perwabkeu-scanner-setup.exe",
      defaultPort: 2020,
      portRangeStart: 2019,
      portRangeEnd: 2030,
      allowedOrigins: [
        "http://localhost:3000",
        "https://perwabkeu.app",
        "https://keuangan.internal.id",
      ],
      host: "127.0.0.1",
      agentVersion: "2.1.0",
      logLevel: "INFO",
      logToFile: true,
      enableMockDev: false,
      updatedAt: "2026-08-16T08:00:00.000Z",
    },
  };

  const versions: ScannerAgentVersion[] = [
    {
      id: "ver_2_1_0",
      version: "2.1.0",
      releaseDate: "2026-08-16",
      status: "latest",
      changelog: [
        "Automatic port hunting & fallback if port 2019 is in use",
        "Dynamic CORS / Allowed Origins configuration",
        "Built-in HTTP root status dashboard at GET /",
        "Configurable Application Identity in health check",
        "ISO timestamped file logging with temp directory retention",
        "COM object garbage collection optimization for WIA locks",
      ],
      checksum: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      minWindowsVersion: "Windows 10 x64 / Windows 11",
      downloadUrl: "/downloads/scanner-agent-v2.1.0.zip",
      sizeBytes: 37655991,
    },
    {
      id: "ver_2_0_0",
      version: "2.0.0",
      releaseDate: "2026-05-12",
      status: "stable",
      changelog: [
        "WIA PowerShell direct script execution",
        "Eliminated CMD multiline string escaping issues",
        "Explicit COM object release via Marshal::ReleaseComObject",
      ],
      checksum: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
      minWindowsVersion: "Windows 10 x64",
      downloadUrl: "/downloads/scanner-agent-v2.0.0.zip",
      sizeBytes: 36800120,
    },
    {
      id: "ver_1_0_1",
      version: "1.0.1",
      releaseDate: "2026-01-20",
      status: "deprecated",
      changelog: [
        "Initial production release for Selaras and Perwabkeu",
        "Fixed port lock issue with scheduled tasks",
      ],
      checksum: "2c6a4e1d1f0545f470fd8bb01fc5187e1f4f5a34e0220d9ecae678d227b686d1",
      minWindowsVersion: "Windows 7 SP1 x64",
      downloadUrl: "/downloads/scanner-agent-v1.0.1.zip",
      sizeBytes: 35400000,
    },
  ];

  const licenses: License[] = [
    {
      id: "lic_selaras_ent",
      applicationId: "app_selaras_2026",
      applicationName: "Selaras Scanner",
      licenseKey: "SCN-ENT-8842-9901-4412-SLR",
      tier: "enterprise",
      status: "active",
      issuedAt: "2026-01-15T08:00:00.000Z",
      expiresAt: "2027-01-15T23:59:59.000Z",
      maxInstances: 500,
      currentInstances: 142,
    },
    {
      id: "lic_perwabkeu_pro",
      applicationId: "app_perwabkeu_2026",
      applicationName: "Perwabkeu Scanner",
      licenseKey: "SCN-PRO-5512-3329-8802-PWB",
      tier: "professional",
      status: "active",
      issuedAt: "2026-02-10T10:30:00.000Z",
      expiresAt: "2027-02-10T23:59:59.000Z",
      maxInstances: 100,
      currentInstances: 38,
    },
  ];

  const selarasIss = generateInnoSetupScript(selarasApp, selarasApp.configuration, "97650377-A6CA-41DC-B557-212828DC8BAC");
  const selarasVbs = generateVbsScript(selarasApp, selarasApp.configuration);
  const selarasBat = generateBatchInstaller(selarasApp, selarasApp.configuration);
  const selarasCfg = generateAgentConfigFile(selarasApp, selarasApp.configuration);

  const installers: InstallerRecord[] = [
    {
      id: "inst_selaras_2026",
      applicationId: "app_selaras_2026",
      applicationName: "Selaras Scanner",
      version: "2.1.0",
      executableName: "SelarasScanner.exe",
      installerFileName: "selaras-scanner-setup.exe",
      checksumSha256: generateSha256(selarasIss + selarasCfg),
      generatedAt: "2026-08-16T08:00:00.000Z",
      innoSetupScript: selarasIss,
      vbsScript: selarasVbs,
      batchScript: selarasBat,
      configJson: selarasCfg,
    },
  ];

  const users: User[] = [
    {
      id: "usr_admin",
      name: "Admin Scanner Platform",
      email: "admin@scanner.local",
      role: "admin",
      companyName: "Scanner Platform HQ",
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "usr_syahroni",
      name: "Syahroni",
      email: "syahroni@selaras.com",
      role: "developer",
      companyName: "PT Selaras Teknologi Mandiri",
      createdAt: "2026-01-15T00:00:00.000Z",
    },
  ];

  return {
    users,
    applications: [selarasApp, perwabkeuApp],
    agentVersions: versions,
    installers,
    licenses,
    activityLogs: [
      {
        id: "act_1",
        action: "Version Release",
        entity: "Scanner Agent v2.1.0 released to Stable Channel",
        timestamp: "2026-08-16T07:30:00.000Z",
        user: "Admin",
      },
      {
        id: "act_2",
        action: "Installer Generated",
        entity: "selaras-scanner-setup.exe updated with multi-port fallback",
        timestamp: "2026-08-16T08:15:00.000Z",
        user: "Syahroni",
      },
      {
        id: "act_3",
        action: "Configuration Updated",
        entity: "Perwabkeu allowed origins whitelist updated",
        timestamp: "2026-08-16T09:00:00.000Z",
        user: "Syahroni",
      },
    ],
  };
}

// function untuk membaca seluruh data dari file database JSON
function readDb(): DatabaseSchema {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initial = getInitialData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }

  try {
    const content = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(content) as DatabaseSchema;
  } catch (err) {
    console.error("Error reading db file, falling back to initial data", err);
    return getInitialData();
  }
}

// function untuk menulis dan menyimpan data ke file database JSON
function writeDb(data: DatabaseSchema): void {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
}

export const db = {
  // --- Applications ---
  // function untuk mengambil seluruh daftar aplikasi scanner terdaftar
  getApplications(): ScannerApplication[] {
    const data = readDb();
    return data.applications;
  },

  // function untuk mengambil data spesifik aplikasi scanner berdasarkan ID
  getApplicationById(id: string): ScannerApplication | undefined {
    const data = readDb();
    return data.applications.find(a => a.id === id);
  },

  // function untuk membuat aplikasi scanner baru beserta konfigurasi, lisensi, dan installernya
  createApplication(params: {
    name: string;
    companyName: string;
    description: string;
    defaultPort?: number;
    executableName?: string;
    installerName?: string;
    allowedOrigins?: string[];
    agentVersion?: string;
  }): ScannerApplication {
    const data = readDb();
    const id = `app_${Math.random().toString(36).substring(2, 10)}`;
    const cleanName = params.name.replace(/[^a-zA-Z0-9]/g, "");
    const exeName = params.executableName || `${cleanName || "Scanner"}.exe`;
    const installerName = params.installerName || `${cleanName || "Scanner"}-Setup.exe`;
    const port = params.defaultPort || 2019;
    const now = dayjs().toISOString();

    const config: ScannerConfiguration = {
      id: `cfg_${Math.random().toString(36).substring(2, 10)}`,
      applicationId: id,
      executableName: exeName,
      installerName,
      defaultPort: port,
      portRangeStart: port,
      portRangeEnd: port + 11,
      allowedOrigins: params.allowedOrigins && params.allowedOrigins.length > 0 ? params.allowedOrigins : ["*"],
      host: "127.0.0.1",
      agentVersion: params.agentVersion || "2.1.0",
      logLevel: "INFO",
      logToFile: true,
      enableMockDev: false,
      updatedAt: now,
    };

    const newApp: ScannerApplication = {
      id,
      name: params.name,
      companyName: params.companyName,
      description: params.description,
      status: "active",
      createdAt: now,
      updatedAt: now,
      configuration: config,
    };

    // Auto-generate license
    const licenseId = `lic_${Math.random().toString(36).substring(2, 10)}`;
    const licenseKey = `SCN-STD-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-APP`;
    const expiryIso = dayjs().add(1, "year").toISOString();

    const license: License = {
      id: licenseId,
      applicationId: id,
      applicationName: newApp.name,
      licenseKey,
      tier: "standard",
      status: "active",
      issuedAt: now,
      expiresAt: expiryIso,
      maxInstances: 50,
      currentInstances: 0,
    };
    newApp.licenseId = licenseId;

    // Auto-generate installer record
    const issScript = generateInnoSetupScript(newApp, config);
    const vbsScript = generateVbsScript(newApp, config);
    const batScript = generateBatchInstaller(newApp, config);
    const cfgJson = generateAgentConfigFile(newApp, config);

    const installer: InstallerRecord = {
      id: `inst_${Math.random().toString(36).substring(2, 10)}`,
      applicationId: id,
      applicationName: newApp.name,
      version: config.agentVersion,
      executableName: config.executableName,
      installerFileName: config.installerName,
      checksumSha256: generateSha256(issScript + cfgJson),
      generatedAt: now,
      innoSetupScript: issScript,
      vbsScript,
      batchScript: batScript,
      configJson: cfgJson,
    };

    data.applications.unshift(newApp);
    data.licenses.push(license);
    data.installers.push(installer);
    data.activityLogs.unshift({
      id: `act_${dayjs().valueOf()}`,
      action: "Application Created",
      entity: `Created application '${newApp.name}' (${id})`,
      timestamp: now,
      user: "User",
    });

    writeDb(data);
    return newApp;
  },

  // function untuk memperbarui metadata aplikasi scanner
  updateApplication(id: string, updates: Partial<ScannerApplication>): ScannerApplication | null {
    const data = readDb();
    const index = data.applications.findIndex(a => a.id === id);
    if (index === -1) return null;

    const existing = data.applications[index];
    const updated: ScannerApplication = {
      ...existing,
      ...updates,
      updatedAt: dayjs().toISOString(),
    };
    data.applications[index] = updated;

    data.activityLogs.unshift({
      id: `act_${dayjs().valueOf()}`,
      action: "Application Updated",
      entity: `Updated application '${updated.name}'`,
      timestamp: dayjs().toISOString(),
      user: "User",
    });

    writeDb(data);
    return updated;
  },

  // function untuk menghapus aplikasi scanner beserta lisensi dan installernya
  deleteApplication(id: string): boolean {
    const data = readDb();
    const index = data.applications.findIndex(a => a.id === id);
    if (index === -1) return false;

    const appName = data.applications[index].name;
    data.applications.splice(index, 1);
    data.installers = data.installers.filter(i => i.applicationId !== id);
    data.licenses = data.licenses.filter(l => l.applicationId !== id);

    data.activityLogs.unshift({
      id: `act_${dayjs().valueOf()}`,
      action: "Application Deleted",
      entity: `Deleted application '${appName}' (${id})`,
      timestamp: dayjs().toISOString(),
      user: "User",
    });

    writeDb(data);
    return true;
  },

  // --- Configuration ---
  // function untuk memperbarui konfigurasi scanner dan meregenerasi installer script secara otomatis
  updateConfiguration(appId: string, updates: Partial<ScannerConfiguration>): ScannerConfiguration | null {
    const data = readDb();
    const app = data.applications.find(a => a.id === appId);
    if (!app) return null;

    const updatedConfig: ScannerConfiguration = {
      ...app.configuration,
      ...updates,
      updatedAt: dayjs().toISOString(),
    };
    app.configuration = updatedConfig;
    app.updatedAt = dayjs().toISOString();

    // Regenerate installer record for this configuration
    const issScript = generateInnoSetupScript(app, updatedConfig);
    const vbsScript = generateVbsScript(app, updatedConfig);
    const batScript = generateBatchInstaller(app, updatedConfig);
    const cfgJson = generateAgentConfigFile(app, updatedConfig);

    const existingInstIdx = data.installers.findIndex(i => i.applicationId === appId);
    const instRecord: InstallerRecord = {
      id: existingInstIdx !== -1 ? data.installers[existingInstIdx].id : `inst_${Math.random().toString(36).substring(2, 10)}`,
      applicationId: appId,
      applicationName: app.name,
      version: updatedConfig.agentVersion,
      executableName: updatedConfig.executableName,
      installerFileName: updatedConfig.installerName,
      checksumSha256: generateSha256(issScript + cfgJson),
      generatedAt: dayjs().toISOString(),
      innoSetupScript: issScript,
      vbsScript,
      batchScript: batScript,
      configJson: cfgJson,
    };

    if (existingInstIdx !== -1) {
      data.installers[existingInstIdx] = instRecord;
    } else {
      data.installers.push(instRecord);
    }

    data.activityLogs.unshift({
      id: `act_${dayjs().valueOf()}`,
      action: "Configuration Changed",
      entity: `Updated configuration for '${app.name}'`,
      timestamp: dayjs().toISOString(),
      user: "User",
    });

    writeDb(data);
    return updatedConfig;
  },

  // --- Installers ---
  // function untuk mengambil installer record dan script setup aplikasi berdasarkan ID
  getInstallerByAppId(appId: string): InstallerRecord | undefined {
    const data = readDb();
    let installer = data.installers.find(i => i.applicationId === appId);
    if (!installer) {
      const app = data.applications.find(a => a.id === appId);
      if (app) {
        const issScript = generateInnoSetupScript(app, app.configuration);
        const vbsScript = generateVbsScript(app, app.configuration);
        const batScript = generateBatchInstaller(app, app.configuration);
        const cfgJson = generateAgentConfigFile(app, app.configuration);
        installer = {
          id: `inst_${Math.random().toString(36).substring(2, 10)}`,
          applicationId: appId,
          applicationName: app.name,
          version: app.configuration.agentVersion,
          executableName: app.configuration.executableName,
          installerFileName: app.configuration.installerName,
          checksumSha256: generateSha256(issScript + cfgJson),
          generatedAt: dayjs().toISOString(),
          innoSetupScript: issScript,
          vbsScript,
          batchScript: batScript,
          configJson: cfgJson,
        };
        data.installers.push(installer);
        writeDb(data);
      }
    }
    return installer;
  },

  // --- Agent Versions ---
  // function untuk mengambil seluruh riwayat rilis versi scanner agent
  getAgentVersions(): ScannerAgentVersion[] {
    const data = readDb();
    return data.agentVersions;
  },

  // function untuk mendaftarkan rilis versi scanner agent baru
  createAgentVersion(versionData: Omit<ScannerAgentVersion, "id">): ScannerAgentVersion {
    const data = readDb();
    const newVersion: ScannerAgentVersion = {
      ...versionData,
      id: `ver_${versionData.version.replace(/\./g, "_")}`,
    };

    // If new status is latest, downgrade old latest to stable
    if (newVersion.status === "latest") {
      data.agentVersions.forEach(v => {
        if (v.status === "latest") v.status = "stable";
      });
    }

    data.agentVersions.unshift(newVersion);
    data.activityLogs.unshift({
      id: `act_${dayjs().valueOf()}`,
      action: "New Version Added",
      entity: `Scanner Agent v${newVersion.version} added`,
      timestamp: dayjs().toISOString(),
      user: "Admin",
    });

    writeDb(data);
    return newVersion;
  },

  // --- Licenses ---
  // function untuk mengambil seluruh daftar lisensi aplikasi yang terbit
  getLicenses(): License[] {
    const data = readDb();
    return data.licenses;
  },

  // function untuk mengambil detail lisensi aplikasi tertentu berdasarkan ID
  getLicenseByAppId(appId: string): License | undefined {
    const data = readDb();
    return data.licenses.find(l => l.applicationId === appId);
  },

  // function untuk membuat atau memperpanjang masa aktif lisensi aplikasi
  createOrRenewLicense(params: {
    applicationId: string;
    tier: "standard" | "professional" | "enterprise";
    durationMonths: number;
    maxInstances: number;
  }): License | null {
    const data = readDb();
    const app = data.applications.find(a => a.id === params.applicationId);
    if (!app) return null;

    const expiryIso = dayjs().add(params.durationMonths, "month").toISOString();
    const licenseKey = `SCN-${params.tier.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${app.name.substring(0, 3).toUpperCase()}`;
    const now = dayjs().toISOString();

    const existingIdx = data.licenses.findIndex(l => l.applicationId === params.applicationId);
    const newLicense: License = {
      id: existingIdx !== -1 ? data.licenses[existingIdx].id : `lic_${Math.random().toString(36).substring(2, 10)}`,
      applicationId: params.applicationId,
      applicationName: app.name,
      licenseKey,
      tier: params.tier,
      status: "active",
      issuedAt: now,
      expiresAt: expiryIso,
      maxInstances: params.maxInstances,
      currentInstances: existingIdx !== -1 ? data.licenses[existingIdx].currentInstances : 0,
    };

    if (existingIdx !== -1) {
      data.licenses[existingIdx] = newLicense;
    } else {
      data.licenses.push(newLicense);
    }
    app.licenseId = newLicense.id;

    data.activityLogs.unshift({
      id: `act_${dayjs().valueOf()}`,
      action: "License Issued",
      entity: `Issued ${params.tier} license for '${app.name}'`,
      timestamp: now,
      user: "Admin",
    });

    writeDb(data);
    return newLicense;
  },

  // --- Dashboard Stats ---
  // function untuk mengkalkulasi statistik ringkasan data untuk dashboard utama
  getDashboardStats(): DashboardStats {
    const data = readDb();
    const totalApplications = data.applications.length;
    const activeApplications = data.applications.filter(a => a.status === "active").length;
    const inactiveApplications = totalApplications - activeApplications;
    const latestVer = data.agentVersions.find(v => v.status === "latest")?.version || "2.1.0";
    const activeLicenses = data.licenses.filter(l => l.status === "active").length;

    return {
      totalApplications,
      activeApplications,
      inactiveApplications,
      latestAgentVersion: latestVer,
      activeLicenses,
      totalInstallersGenerated: data.installers.length,
      recentActivity: data.activityLogs.slice(0, 6),
    };
  },
};
