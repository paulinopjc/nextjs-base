import Form from '@components/cms/edit-form';
import Breadcrumbs from '@ui/breadcrumbs';
import { fetchCMSById } from '@lib/cms/data';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

type ParamsType = Promise<{ id: string }>;

export default async function Page({ params }: { params: ParamsType }) {
  const { id } = await params;
  let page;

  try {
    page = await fetchCMSById(id);
    if (!page?.id) {
      notFound();
    }
  } catch {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'CMS Pages', href: '/dashboard/cms' },
          {
            label: 'Edit Page',
            href: `/dashboard/cms/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form page={page} />
    </main>
  );
}
