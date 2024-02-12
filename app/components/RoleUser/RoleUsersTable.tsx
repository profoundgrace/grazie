import { Box, Button, Table, Title } from '@mantine/core';
import DateTime from '~/components/DateTime';
import classes from '~/components/Dashboard/AdminPost.module.css';
import RoleUserEditor from '~/components/RoleUser/Editor';
import { useState } from 'react';
import { IconSquarePlus } from '@tabler/icons-react';
import { Role } from '~/types/Role';
import { RoleUser } from '~/types/RoleUser';

export default function RoleUsersTable({
  role,
  users
}: {
  role: Role;
  users: { nodes: RoleUser[] };
}) {
  const [openEditor, setOpenEditor] = useState(false);

  const [roleUserEditor, setRoleUserEditor] = useState(null);

  const rows =
    users?.nodes?.length > 0 ? (
      users.nodes.map((row) => (
        <Table.Tr key={`role-user-${row.id}`}>
          <Table.Td>{row.user.id}</Table.Td>
          <Table.Td>{row.user.username}</Table.Td>
          <Table.Td>{row.user.displayName}</Table.Td>
          <Table.Td>{row.user.email}</Table.Td>
          <Table.Td>
            <DateTime timestamp={row.user.createdAt} />
          </Table.Td>

          <Table.Td>{row.user.banned ? 'Yes' : 'No'}</Table.Td>
        </Table.Tr>
      ))
    ) : (
      <Table.Tr>
        <Table.Td colSpan={6}>
          No Users Assigned to {role.name?.toUpperCase()} Role
        </Table.Td>
      </Table.Tr>
    );

  return (
    <Box
      style={{
        border: '1px solid var(--mantine-color-dark-6)',
        padding: '10px'
      }}
    >
      <Title order={2}>{role.name?.toUpperCase()} Role Users</Title>
      {!openEditor && (
        <Box my={10}>
          <Button
            leftSection={<IconSquarePlus size={14} />}
            onClick={() => setOpenEditor(true)}
            variant="light"
            color="yellow"
          >
            Assign Role Users
          </Button>
        </Box>
      )}
      {openEditor && (
        <Box my={10}>
          <RoleUserEditor closeEditor={setOpenEditor} roleId={role.id} />
        </Box>
      )}
      <Table stickyHeader withTableBorder stickyHeaderOffset={60} miw={700}>
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
    </Box>
  );
}
