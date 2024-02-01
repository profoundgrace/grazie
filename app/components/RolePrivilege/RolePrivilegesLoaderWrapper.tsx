import { useLoaderData } from '@remix-run/react';
import RolePrivilegesTable from './RolePrivilegesTable';

export default function RoleUserAdmin() {
  const { privileges } = useLoaderData();

  return <RolePrivilegesTable privileges={privileges} />;
}
