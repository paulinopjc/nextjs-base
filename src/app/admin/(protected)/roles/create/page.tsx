import Form from '@components/roles/create-form';
import Breadcrumbs from '@ui/breadcrumbs';

export const dynamic = 'force-dynamic';
 
export default async function Page() {
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Roles', href: '/admin/roles' },
          {
            label: 'Create Role',
            href: '/admin/roles/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}