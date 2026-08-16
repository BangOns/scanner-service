import { NextResponse } from "next/server";

// function untuk mengembalikan response sukses API dengan format standar
export function apiSuccess<T>(data: T, status = 200, headers: Record<string, string> = {}) {
  return NextResponse.json({ success: true, data }, { status, headers });
}

// function untuk mengembalikan response error API dengan format standar
export function apiError(
  err: unknown,
  defaultMessage = "Internal server error",
  status = 500
) {
  const message = err instanceof Error ? err.message : typeof err === "string" ? err : defaultMessage;
  return NextResponse.json({ success: false, error: message }, { status });
}

// function untuk memvalidasi dan memastikan nomor port valid (1024 - 65535)
export function parsePort(value: unknown, fallback = 2019): number {
  const parsed = Number(value);
  if (Number.isInteger(parsed) && parsed >= 1024 && parsed <= 65535) {
    return parsed;
  }
  return fallback;
}
