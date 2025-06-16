'use client';

import { useState } from 'react';
import { lusitana } from '@ui/fonts';
import Pagination from '@ui/pagination';
import Search from '@ui/search';
import CMSTable from '@components/cms/CMSTable';
import { CreateCMS } from '@components/cms/CMSButtons';
import type { CMS } from '@/lib/definitions';

type Props = {
  cmsPages: CMS[];
  totalPages: number;
  query?: string;
};

export default function CMSPageClient({ cmsPages, totalPages, query = '' }: Props) {
  const [isPending, setIsPending] = useState(false);

  const isSearchActive = query.trim().length > 0;
  const hasInitialData = totalPages > 0 || isSearchActive;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>CMS Pages</h1>
      </div>

      {hasInitialData && (
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search CMS pages..." onSearchPending={setIsPending} />
          <CreateCMS />
        </div>
      )}

      {totalPages === 0 ? (
        isSearchActive ? (
          <p className="mt-6 text-gray-500">No CMS pages found for your search.</p>
        ) : (
          <>
            <p className="mt-6 text-gray-500">Add your first CMS page</p>
            <div className="mt-4">
              <CreateCMS />
            </div>
          </>
        )
      ) : (
        <div className="relative mt-4">
          <div
            className={`transition duration-300 ${
              isPending ? 'blur-sm pointer-events-none' : ''
            }`}
          >
            <CMSTable cms={cmsPages} />

            {totalPages > 1 && (
              <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
              </div>
            )}
          </div>

          {isPending && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
              <span className="text-gray-700 text-sm">Loading results...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
