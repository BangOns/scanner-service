import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError, parsePort } from "@/lib/api-response";

export async function GET() {
  try {
    const apps = db.getApplications();
    return apiSuccess(apps);
  } catch (err: unknown) {
    return apiError(err, "Failed to fetch applications");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, companyName, description, defaultPort, executableName, installerName, allowedOrigins, agentVersion } = body;

    if (!name || !companyName) {
      return NextResponse.json(
        { success: false, error: "Application Name dan Company Name wajib diisi." },
        { status: 400 }
      );
    }

    const newApp = db.createApplication({
      name,
      companyName,
      description: description || "",
      defaultPort: parsePort(defaultPort, 2019),
      executableName,
      installerName,
      allowedOrigins: Array.isArray(allowedOrigins) ? allowedOrigins : (allowedOrigins ? allowedOrigins.split(",").map((s: string) => s.trim()).filter(Boolean) : ["*"]),
      agentVersion: agentVersion || "2.1.0",
    });

    return apiSuccess(newApp, 201);
  } catch (err: unknown) {
    return apiError(err, "Failed to create application");
  }
}
