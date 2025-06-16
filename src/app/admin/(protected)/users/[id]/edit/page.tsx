import Form from '@components/users/edit-form';
import Breadcrumbs from '@ui/breadcrumbs';
import { fetchUserById } from '@lib/users/data';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
 
export default async function Page(props: { params: Promise<{ id: string }> }) {
	const params = await props.params;
	const id = params.id;
	const [user] = await Promise.all([
		fetchUserById(id),
	]);

	if (!user) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Users', href: '/admin/users' },
          {
            label: 'Edit User',
            href: `/admin/users/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form user={user} />
    </main>
  );
}