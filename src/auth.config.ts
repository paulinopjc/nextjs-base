// src/auth.config.ts
// This file defines the COMPLETE AuthOptions configuration for NextAuth.js v4.

import type { NextAuthOptions } from 'next-auth'; // Use NextAuthOptions for v4
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { User } from './lib/definitions'; // Assuming your User type is here

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getUserByEmail(email: string): Promise<User | undefined> {
  try {
    const result = await sql<User[]>`SELECT id, name, email, password FROM users WHERE email = ${email}`;
    return result[0]; // undefined if no user
  } catch (error) {
    console.error('DB error in getUserByEmail:', error);
    throw new Error('Database error');
  }
}

export const authConfig: NextAuthOptions = { // Use NextAuthOptions
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
          id: user.id.toString(), // Ensure ID is a string
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Store user ID in token for session callback
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string; // Assign ID from token to session user
      }
      return session;
    },
  },
  // In v4, 'secret' is often defined here or via NEXTAUTH_SECRET env variable
  // secret: process.env.NEXTAUTH_SECRET, // Make sure you have this env var
};