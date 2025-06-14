'use client';

import Table from '@ui/table';
import { UpdateUser, DeleteUser } from '@components/users/UserButtons';

export default function UsersTable({ users }: { users: any[] }) {

  const columns = [
    {
      key: 'name',
      label: 'User',
      render: (user: any) => <p>{user.name}</p>,
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'roleName',
      label: 'Role',
    },
    {
      key: 'actions',
      label: '',
      render: (user: any) => (
        <div className="flex justify-end gap-3">
          <UpdateUser id={user.id} />
          <DeleteUser id={user.id} />
        </div>
      ),
    },
  ];

  const renderMobile = (user: any) => (
    <>
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <UpdateUser id={user.id} />
        <DeleteUser id={user.id} />
      </div>
    </>
  );

  return <Table data={users} columns={columns} mobileRender={renderMobile} />;
}
