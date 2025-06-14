import { redirect } from 'next/navigation';
import auth from 'next-auth';
import { authConfig } from '@lib/auth/options';
import SideNav from '@components/dashboard/sidenav';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  const session = auth(authConfig);

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}