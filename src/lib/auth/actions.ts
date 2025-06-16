'use server';

import { signIn } from 'next-auth/react';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const result = await signIn('credentials', {
      redirect: false,
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (result?.error === 'CredentialsSignin') {
      return 'Invalid credentials.';
    }

    if (result?.error) {
      return 'Something went wrong.';
    }

    return undefined; // success
  } catch (error) {
    console.error('Auth error:', error);
    return 'Something went wrong.';
  }
}
