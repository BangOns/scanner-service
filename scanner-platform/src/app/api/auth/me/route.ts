import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("scanner_session");

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Sesi tidak ditemukan.", data: null },
        { status: 401 }
      );
    }

    try {
      const user = JSON.parse(sessionCookie.value);
      return apiSuccess(user);
    } catch {
      const response = NextResponse.json(
        { success: false, error: "Session corrupted", data: null },
        { status: 401 }
      );
      response.cookies.delete("scanner_session");
      return response;
    }
  } catch (err: unknown) {
    return apiError(err, "Failed to fetch session");
  }
}
