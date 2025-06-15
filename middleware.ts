// middleware.ts
import { auth } from "@/lib/auth"; // uses `authOptions`
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();

  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPath = request.nextUrl.pathname === "/admin/login";

  // If not logged in, redirect to login
  if (!session?.user && isAdminPath && !isLoginPath) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // If logged in and trying to access login page, redirect to dashboard
  if (session?.user && isLoginPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If logged in and visiting /admin directly, redirect to /dashboard
  if (session?.user && request.nextUrl.pathname === "/admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};

