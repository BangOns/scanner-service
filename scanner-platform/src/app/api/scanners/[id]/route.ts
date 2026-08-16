import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/api-response";

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
    return apiSuccess(app);
  } catch (err: unknown) {
    return apiError(err, "Error fetching application");
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = db.updateApplication(id, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    return apiSuccess(updated);
  } catch (err: unknown) {
    return apiError(err, "Failed to update application");
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = db.deleteApplication(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Application deleted successfully" });
  } catch (err: unknown) {
    return apiError(err, "Failed to delete application");
  }
}
