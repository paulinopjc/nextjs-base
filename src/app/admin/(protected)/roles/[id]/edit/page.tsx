import Form from '@components/roles/edit-form';
import Breadcrumbs from '@ui/breadcrumbs';
import { fetchRoleById } from '@lib/roles/data';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
 
export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    const [role] = await Promise.all([
        fetchRoleById(id),
    ]);

    if (!role) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Roles', href: '/admin/roles' },
          {
            label: 'Edit Role',
            href: `/admin/roles/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form role={role} />
    </main>
  );
}