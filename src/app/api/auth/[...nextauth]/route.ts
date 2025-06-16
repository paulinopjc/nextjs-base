import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/options";

const handler = NextAuth(authOptions);

export const GET = async (req: Request) => {
  try {
    return await handler.auth(req);
  } catch (error) {
    console.error("NextAuth GET handler error:", error);
    throw error;
  }
};

export const POST = async (req: Request) => {
  try {
    return await handler.auth(req);
  } catch (error) {
    console.error("NextAuth POST handler error:", error);
    throw error;
  }
};
