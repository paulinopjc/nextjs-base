import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getUserByEmail(email: string) {
  try {
    const result = await sql`SELECT id, name, email, password FROM users WHERE email = ${email}`;
    return result[0]; // undefined if no user
  } catch (error) {
    console.error('DB error in getUserByEmail:', error);
    throw new Error('Database error');
  }
}

export const authConfig: NextAuthOptions = {
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials ?? {};

        if (!email || !password) return null;

        const user = await getUserByEmail(email);
        if (!user) return null;

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return null;

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
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
  },
};
