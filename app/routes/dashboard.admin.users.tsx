import { Table, Title } from '@mantine/core';
import { LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import classes from '~/components/Dashboard/AdminPost.module.css';
import DateTime from '~/components/DateTime';
import { getUsers } from '~/lib/user.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const users = await getUsers({
    select: {
      id: true,
      username: true,
      displayName: true,
      email: true,
      createdAt: true,
      banned: true
    }
  });
  return json({ _page: 'dashboard', users });
}

export default function UserAdmin() {
  const { users } = useLoaderData();

  const rows = users.nodes.map((row) => (
    <Table.Tr key={row.slug}>
      <Table.Td>{row.id}</Table.Td>
      <Table.Td>{row.username}</Table.Td>
      <Table.Td>{row.displayName}</Table.Td>
      <Table.Td>{row.email}</Table.Td>
      <Table.Td>
        <DateTime timestamp={row.createdAt} />
      </Table.Td>

      <Table.Td>{row.banned ? 'Yes' : 'No'}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Title>Users</Title>
      <Table stickyHeader stickyHeaderOffset={60} miw={700}>
        <Table.Thead className={classes.header}>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Username</Table.Th>
            <Table.Th>Display</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Joined</Table.Th>
            <Table.Th>Banned</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
}
