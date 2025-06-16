import Form from '@components/users/create-form';
import Breadcrumbs from '@ui/breadcrumbs';

// Force dynamic rendering for this page to prevent prerendering errors
export const dynamic = 'force-dynamic';

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Users', href: '/admin/users' },
          {
            label: 'Create User',
            href: '/admin/users/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}
