'use server';

import { signIn } from '@/auth';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'type' in error) {
      const e = error as { type?: string };
      if (e.type === 'CredentialsSignin') {
        return 'Invalid credentials.';
      }
    }
    return 'Something went wrong.';
  }
}
