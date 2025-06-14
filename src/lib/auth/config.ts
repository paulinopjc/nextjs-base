// lib/auth/config.ts
import GitHub from 'next-auth/providers/github';
import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth/signin', // optional
  },
  callbacks: {
    async session({ session }) {
      // optionally enhance session
      return session;
    },
    async jwt({ token }) {
      // optionally enhance token
      return token;
    },
  },
};
