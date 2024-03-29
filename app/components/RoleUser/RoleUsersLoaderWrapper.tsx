/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { useLoaderData } from '@remix-run/react';
import RoleUsersTable from './RoleUsersTable';

export default function RoleUserAdmin() {
  const { users } = useLoaderData();

  return <RoleUsersTable users={users} />;
}
