// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// In v4, you can directly import getToken (or getSession if using database sessions)
import { getToken } from 'next-auth/jwt'; // For JWT session strategy
// If you were using database sessions, you might import { getSession } from 'next-auth/react';
// and then use it in a trickier way in middleware. getToken is generally preferred for middleware.

export async function middleware(request: NextRequest) {
  // In v4, for JWT, you get the token from the request
  const token = await getToken({ req: request });
  const isLoggedIn = !!token; // If token exists, user is logged in

  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPath = request.nextUrl.pathname === "/admin/login";

  // If not logged in, redirect to login
  if (!isLoggedIn && isAdminPath && !isLoginPath) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // If logged in and trying to access login page, redirect to dashboard
  if (isLoggedIn && isLoginPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If logged in and visiting /admin directly, redirect to /dashboard
  if (isLoggedIn && request.nextUrl.pathname === "/admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};