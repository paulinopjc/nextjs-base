import signIn from 'next-auth/react';
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth.config";

export const auth = () => getServerSession(authConfig);
export { signIn };