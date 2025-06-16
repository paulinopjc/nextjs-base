import Form from '@components/cms/edit-form';
import Breadcrumbs from '@ui/breadcrumbs';
import { fetchCMSById } from '@lib/cms/data';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const page = await fetchCMSById(id);

  console.log(id);
  console.log(page);

  if (!page) {
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
