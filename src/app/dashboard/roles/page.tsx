import { Suspense } from 'react';
import RolesPageClient from '@components/roles/RolesPageClient';
import { fetchRoles, fetchRolePages } from '@lib/roles/data';
import { RolesTableSkeleton } from '@ui/skeletons';

export default async function Page({
  searchParams,
}: {
  searchParams?: Record<string, string | string[]>;
}) {
  const query = Array.isArray(searchParams?.query)
    ? searchParams.query[0] ?? ''
    : searchParams?.query ?? '';

  const pageStr = Array.isArray(searchParams?.page)
    ? searchParams.page[0]
    : searchParams?.page;

  const page = Number(pageStr) || 1;

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

