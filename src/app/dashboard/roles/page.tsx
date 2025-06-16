import { Suspense } from 'react';
import RolesPageClient from '@components/roles/RolesPageClient';
import { fetchRoles, fetchRolePages } from '@lib/roles/data';
import { RolesTableSkeleton } from '@ui/skeletons';

export const dynamic = 'force-dynamic';

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


