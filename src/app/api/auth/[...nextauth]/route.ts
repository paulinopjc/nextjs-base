// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/options";

// v5 App Router: `.auth` contains the GET/POST handlers
const handler = NextAuth(authOptions);

export const GET = handler.auth;
export const POST = handler.auth;
