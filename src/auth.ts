// src/auth.ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config'; // This will be redefined below
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User } from '@/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    // Return undefined or rethrow a more specific, sanitized error if needed.
    return undefined;
  }
}

// In NextAuth.js v4, the authConfig defines ALL options
// You should typically pass a single options object here.
// The 'authConfig' from src/auth.config.ts will be the complete AuthOptions.
export const {
  handlers: { GET, POST }, // Import handlers for API routes
  auth, // The main authentication helper (used for getServerSession)
  signIn,
  signOut,
} = NextAuth({
  // Use the full authConfig object here
  // Providers and callbacks *must* be defined in auth.config.ts for v4
  ...authConfig,
  providers: [ // Even though it's spread from authConfig, often re-defined or extended here
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your-email@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) {
            console.log('User not found.');
            return null;
          }
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            return {
              id: user.id, // Make sure user.id is a string (UUID from DB)
              name: user.name,
              email: user.email,
            };
          }
        }
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});

// For App Router, `auth` is imported from here for server components and actions.
// `signIn` and `signOut` are also imported from here.
// API routes (e.g., app/api/auth/[...nextauth]/route.ts) use GET, POST handlers.