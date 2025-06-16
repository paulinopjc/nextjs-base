// lib/auth.ts
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// This works in both `middleware` and server components
export const { auth } = NextAuth(authConfig);
