'use client';

import Table from '@ui/table';
import { UpdateCMS, DeleteCMS } from '@components/cms/CMSButtons';
import type { CMS } from '@/lib/definitions';

export default function CMSTable({ cms }: { cms: CMS[] }) {
  const columns = [
    {
      key: 'name',
      label: 'Title',
      render: (cms: CMS) => <p>{cms.name}</p>,
    },
    {
      key: 'slug',
      label: 'Slug',
    },
    {
      key: 'status',
      label: 'Status',
    },
    {
      key: 'updatedByName',
      label: 'Updated By',
    },
    {
      key: 'actions',
      label: '',
      render: (cms: CMS) => (
        <div className="flex justify-end gap-3">
          <UpdateCMS id={cms.id} />
          <DeleteCMS id={cms.id} />
        </div>
      ),
    },
  ];

  const renderMobile = (cms: CMS) => (
    <>
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <p className="font-medium">{cms.name}</p>
          <p className="text-sm text-gray-500">{cms.slug}</p>
          <p className="text-sm text-gray-500">{cms.status}</p>
          <p className="text-sm text-gray-500">Updated by: {cms.updatedByName ?? '—'}</p>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <UpdateCMS id={cms.id} />
        <DeleteCMS id={cms.id} />
      </div>
    </>
  );

  return <Table data={cms} columns={columns} mobileRender={renderMobile} />;
}
