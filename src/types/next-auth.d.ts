// src/types/next-auth.d.ts
// import NextAuth from "next-auth";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
  }

  interface JWT {
    sub: string;
  }
}
