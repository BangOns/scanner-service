import { NextResponse } from "next/server";
import dayjs from "dayjs";
import { db } from "@/lib/db";
import { apiError } from "@/lib/api-response";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    db.getDashboardStats(); // check db readiness
    const user = {
      id: email.includes("admin") ? "usr_admin" : "usr_syahroni",
      name: email.includes("admin") ? "Administrator" : "Syahroni",
      email: email,
      role: email.includes("admin") ? ("admin" as const) : ("developer" as const),
      companyName: email.includes("admin") ? "Platform Admin" : "PT Selaras Teknologi Mandiri",
      createdAt: dayjs().toISOString(),
    };

    const response = NextResponse.json({
      success: true,
      data: {
        user,
        token: `jwt_demo_${Buffer.from(JSON.stringify(user)).toString("base64")}`,
      },
    });

    response.cookies.set({
      name: "scanner_session",
      value: JSON.stringify(user),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: unknown) {
    return apiError(err, "Internal server error during login");
  }
}
