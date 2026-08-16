import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// function middleware untuk memfilter, mengamankan rute, dan mengatur redirect otentikasi
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("scanner_session");
  const isAuthenticated = Boolean(sessionCookie?.value);

  const isAuthRoute = pathname === "/login" || pathname === "/register";
  const isPublicRoute = pathname === "/" || isAuthRoute;
  const isApiRoute = pathname.startsWith("/api");

  // Lewatkan request API agar ditangani oleh masing-masing route handler
  if (isApiRoute) {
    return NextResponse.next();
  }

  // 1. Jika pengguna sudah login dan membuka /login atau /register, redirect ke /dashboard
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. Jika pengguna belum login dan mengakses rute terproteksi, redirect ke /login dengan parameter 'from'
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Matikan cache browser (bfcache) pada halaman terproteksi agar tombol back browser aman
  const response = NextResponse.next();
  if (!isPublicRoute) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
