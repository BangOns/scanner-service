import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError, parsePort } from "@/lib/api-response";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const app = db.getApplicationById(id);
    if (!app) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }
    return apiSuccess(app.configuration);
  } catch (err: unknown) {
    return apiError(err, "Failed to fetch configuration");
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.defaultPort !== undefined) body.defaultPort = parsePort(body.defaultPort, 2019);
    if (body.portRangeStart !== undefined) body.portRangeStart = parsePort(body.portRangeStart, 2019);
    if (body.portRangeEnd !== undefined) body.portRangeEnd = parsePort(body.portRangeEnd, 2030);
    if (typeof body.allowedOrigins === "string") {
      body.allowedOrigins = body.allowedOrigins.split(",").map((s: string) => s.trim()).filter(Boolean);
    }

    const updated = db.updateConfiguration(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated, message: "Configuration updated successfully." });
  } catch (err: unknown) {
    return apiError(err, "Failed to update configuration");
  }
}
