// lib/auth/getSessionUser.ts
import { auth } from "@/lib/auth" // 👈 the one from lib/auth.ts

export async function getSessionUser() {
  const session = await auth(); // works in server components, route handlers, etc.

  if (session?.user) {
    return session.user;
  }

  return null;
}
