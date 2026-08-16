import { db } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET() {
  try {
    const licenses = db.getLicenses();
    return apiSuccess(licenses);
  } catch (err: unknown) {
    return apiError(err, "Failed to fetch licenses");
  }
}
