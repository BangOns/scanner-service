import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const license = db.getLicenseByAppId(id);
    if (!license) {
      return NextResponse.json({ success: false, error: "License not found" }, { status: 404 });
    }
    return apiSuccess(license);
  } catch (err: unknown) {
    return apiError(err, "Failed to fetch license");
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { tier, durationMonths, maxInstances } = body;

    const license = db.createOrRenewLicense({
      applicationId: id,
      tier: tier || "standard",
      durationMonths: durationMonths ? parseInt(durationMonths, 10) : 12,
      maxInstances: maxInstances ? parseInt(maxInstances, 10) : 50,
    });

    if (!license) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    return apiSuccess(license);
  } catch (err: unknown) {
    return apiError(err, "Failed to issue license");
  }
}
