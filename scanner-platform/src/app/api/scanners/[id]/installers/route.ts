import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const installer = db.getInstallerByAppId(id);
    if (!installer) {
      return NextResponse.json({ success: false, error: "Installer record not found" }, { status: 404 });
    }
    return apiSuccess(installer);
  } catch (err: unknown) {
    return apiError(err, "Failed to fetch installer");
  }
}
