import Form from '@components/cms/create-form';
import Breadcrumbs from '@ui/breadcrumbs';

export const dynamic = 'force-dynamic';

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'CMS', href: '/admin/cms' },
          {
            label: 'Create Page',
            href: '/admin/cms/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
