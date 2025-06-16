import { redirect } from 'next/navigation';
import { getSessionUser } from '@lib/auth/getSessionUser';

export const dynamic = 'force-dynamic'; // Disable prerendering, render on each request

export default async function AdminPage() {
  try {
    const user = await getSessionUser();

    if (!user) {
      redirect('/admin/login');
    } else {
      redirect('/dashboard');
    }
  } catch {
    // On error, redirect to login as a safe fallback
    redirect('/admin/login');
  }
}
