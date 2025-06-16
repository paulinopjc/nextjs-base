// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';

const handler = NextAuth(authConfig);

// This is the correct way to export for App Router API routes
export { handler as GET, handler as POST };
