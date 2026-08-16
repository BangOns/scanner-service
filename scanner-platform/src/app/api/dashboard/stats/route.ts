import { db } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET() {
  try {
    const stats = db.getDashboardStats();
    return apiSuccess(stats);
  } catch (err: unknown) {
    return apiError(err, "Failed to get stats");
  }
}
