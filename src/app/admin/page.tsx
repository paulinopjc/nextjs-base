import { redirect } from 'next/navigation';
import { getSessionUser } from '@lib/auth/getSessionUser';

export default async function AdminPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/admin/login');
  } else {
    redirect('/dashboard');
  }
}
