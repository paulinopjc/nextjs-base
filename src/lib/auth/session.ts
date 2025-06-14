// lib/auth/getSessionUser.ts
import auth from 'next-auth';
import { authConfig } from '@/lib/auth/config';

export async function getSessionUser() {
  const session = await auth(authConfig);

  // Type guard for JWT-based session
  if (session && 'user' in session) {
    return session.user;
  }

  return null;
}
