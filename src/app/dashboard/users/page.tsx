import { Suspense } from 'react';
import UsersPageClient from '@components/users/UsersPageClient';
import { fetchUsers, fetchUserPages } from '@lib/users/data';
import { UsersTableSkeleton } from '@/ui/skeletons';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await searchParams;

  const query = Array.isArray(resolvedParams.query)
    ? resolvedParams.query[0] ?? ''
    : resolvedParams.query ?? '';

  const pageStr = Array.isArray(resolvedParams.page)
    ? resolvedParams.page[0]
    : resolvedParams.page;

  const page = Number(pageStr) || 1;

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
