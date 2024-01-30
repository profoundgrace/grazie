import { useLoaderData } from '@remix-run/react';
import RoleUsersTable from './RoleUsersTable';

export default function RoleUserAdmin() {
  const { users } = useLoaderData();

  return <RoleUsersTable users={users} />;
}
