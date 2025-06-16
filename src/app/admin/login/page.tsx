import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@lib/auth/getSessionUser';
import LoginPageClient from '@/components/auth/login-client';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const user = await getSessionUser();

  if (user) {
    redirect('/admin/dashboard');
  }

  return (
    <Suspense>
      <LoginPageClient />
    </Suspense>
  );
}
