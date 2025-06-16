'use client';

import Table from '@ui/table';
import { UpdateRole, DeleteRole } from '@components/roles/RoleButtons';
import type { Role } from '@/lib/definitions';

export default function RolesTable({ roles }: { roles: Role[] }) {

  const columns = [
    {
      key: 'name',
      label: 'Role',
      render: (role: Role) => <p>{role.name}</p>,
    },
    {
      key: 'actions',
      label: '',
      render: (role: Role) => (
        <div className="flex justify-end gap-3">
          <UpdateRole id={role.id} />
          <DeleteRole id={role.id} />
        </div>
      ),
    },
  ];

  const renderMobile = (role: Role) => (
    <>
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <p className="font-medium">{role.name}</p>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <UpdateRole id={role.id} />
        <DeleteRole id={role.id} />
      </div>
    </>
  );

  return <Table data={roles} columns={columns} mobileRender={renderMobile} />;
}
