import type { NextAuthOptions } from 'next-auth';

export const authConfig: NextAuthOptions = {
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      // user is only available on first login
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.sub === 'string') {
        session.user.id = token.sub;
      }
      return session;
    },
    // Remove unauthorized callback; use signIn or middleware for access control
  },
  providers: [], // still empty, defined later in src/auth.ts
};
