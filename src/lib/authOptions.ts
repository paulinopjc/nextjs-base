// src/lib/authOptions.ts
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { compare } from "bcrypt";

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
				credentials: Partial<Record<"email" | "password", unknown>>
			) {
				const email = credentials?.email;
				const password = credentials?.password;

				// Validate and narrow the types
				if (typeof email !== "string" || typeof password !== "string") {
					return null;
				}

				const user = await prisma.user.findUnique({
					where: { email },
				});

				if (!user || !user.password) return null;

				const isValid = await compare(password, user.password);
				if (!isValid) return null;

				return {
					id: user.id,
					name: user.name,
					email: user.email,
				};
			},
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
			if (session.user && typeof token.id === 'string') {
				session.user.id = token.id;
			}
			return session;
		},
  },
};
