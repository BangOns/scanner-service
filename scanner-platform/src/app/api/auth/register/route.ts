import { NextResponse } from "next/server";
import dayjs from "dayjs";
import { apiError } from "@/lib/api-response";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, companyName } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Nama dan email wajib diisi" },
        { status: 400 }
      );
    }

    const newUser = {
      id: `usr_${Math.random().toString(36).substring(2, 10)}`,
      name,
      email,
      role: "developer" as const,
      companyName: companyName || "My Company",
      createdAt: dayjs().toISOString(),
    };

    const response = NextResponse.json({
      success: true,
      data: {
        user: newUser,
        token: `jwt_demo_${Buffer.from(JSON.stringify(newUser)).toString("base64")}`,
      },
    });

    response.cookies.set({
      name: "scanner_session",
      value: JSON.stringify(newUser),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: unknown) {
    return apiError(err, "Registration failed");
  }
}
