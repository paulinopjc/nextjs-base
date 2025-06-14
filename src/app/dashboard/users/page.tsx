import { Suspense } from 'react';
import UsersPageClient from '@components/users/UsersPageClient';
import { fetchUsers, fetchUserPages } from '@lib/users/data';
import { UsersTableSkeleton } from '@/ui/skeletons';

export default async function Page({ searchParams }: { searchParams?: { query?: string; page?: string } }) {
  const query = searchParams?.query || '';
  const page = Number(searchParams?.page || '1');

  const [users, totalPages] = await Promise.all([
    fetchUsers(query, page),
    fetchUserPages(query),
  ]);

  return (
    <Suspense fallback={<UsersTableSkeleton />}>
      <UsersPageClient users={users} totalPages={totalPages} query={query} />
    </Suspense>
  );
}
