import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { success: true, message: "Logged out successfully" },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );

  response.cookies.set({
    name: "scanner_session",
    value: "",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
    httpOnly: false,
    sameSite: "lax",
  });

  return response;
}
