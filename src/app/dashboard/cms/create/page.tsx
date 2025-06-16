import Form from '@components/cms/create-form';
import Breadcrumbs from '@ui/breadcrumbs';

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'CMS', href: '/dashboard/cms' },
          {
            label: 'Create Page',
            href: '/dashboard/cms/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
