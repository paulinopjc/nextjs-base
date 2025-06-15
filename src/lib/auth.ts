// lib/auth.ts
import NextAuth from "next-auth";
import { authOptions } from "./authOptions";

// This works in both `middleware` and server components
export const { auth } = NextAuth(authOptions);
