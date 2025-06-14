import Form from '@components/roles/create-form';
import Breadcrumbs from '@ui/breadcrumbs';
 
export default async function Page() {
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Roles', href: '/dashboard/roles' },
          {
            label: 'Create Role',
            href: '/dashboard/roles/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}