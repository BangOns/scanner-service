import { NextResponse } from "next/server";
import dayjs from "dayjs";
import { db } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET() {
  try {
    const versions = db.getAgentVersions();
    return apiSuccess(versions);
  } catch (err: unknown) {
    return apiError(err, "Failed to fetch versions");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { version, status, changelog, checksum, minWindowsVersion, downloadUrl } = body;

    if (!version) {
      return NextResponse.json(
        { success: false, error: "Version string is required" },
        { status: 400 }
      );
    }

    const newVersion = db.createAgentVersion({
      version,
      status: status || "stable",
      releaseDate: dayjs().format("YYYY-MM-DD"),
      changelog: Array.isArray(changelog) ? changelog : (changelog ? changelog.split("\n").filter(Boolean) : []),
      checksum: checksum || "auto_generated_sha256",
      minWindowsVersion: minWindowsVersion || "Windows 10 x64 / Windows 11",
      downloadUrl: downloadUrl || `/downloads/scanner-agent-v${version}.zip`,
      sizeBytes: 37655991,
    });

    return apiSuccess(newVersion, 201);
  } catch (err: unknown) {
    return apiError(err, "Failed to create version");
  }
}
