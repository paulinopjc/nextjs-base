import { Suspense } from 'react';
import RolesPageClient from '@components/roles/RolesPageClient';
import { fetchRoles, fetchRolePages } from '@lib/roles/data';
import { RolesTableSkeleton } from '@ui/skeletons';

export default async function Page({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const query = typeof searchParams?.query === 'string' ? searchParams.query : '';
  const page = typeof searchParams?.page === 'string' ? Number(searchParams.page) : 1;

  const [roles, totalPages] = await Promise.all([
    fetchRoles(query, page),
    fetchRolePages(query),
  ]);

  return (
    <Suspense fallback={<RolesTableSkeleton />}>
      <RolesPageClient roles={roles} totalPages={totalPages} query={query} />
    </Suspense>
  );
}

