import { Suspense } from 'react';
import CMSPageClient from '@components/cms/CMSPageClient';
import { fetchCMSPages, fetchCMSPageCount } from '@/lib/cms/data';
import { CMSTableSkeleton } from '@/ui/skeletons';

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

  const [cmsPages, totalPages] = await Promise.all([
    fetchCMSPages(query, page),
    fetchCMSPageCount(query),
  ]);

  return (
    <Suspense fallback={<CMSTableSkeleton />}>
      <CMSPageClient cmsPages={cmsPages} totalPages={totalPages} query={query} />
    </Suspense>
  );
}
