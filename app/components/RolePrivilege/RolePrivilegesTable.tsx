import { Box, Button, Table, Title } from '@mantine/core';
import { Privilege } from '~/types/Privilege';
import DateTime from '~/components/DateTime';
import classes from '~/components/Dashboard/AdminPost.module.css';
import RolePrivilegeEditor from '~/components/RolePrivilege/Editor';
import { useState } from 'react';
import { IconSquarePlus } from '@tabler/icons-react';
import { Role } from '~/types/Role';
import { RolePrivilege } from '~/types/RolePrivilege';

export default function RolePrivilegesTable({
  role,
  privileges
}: {
  role: Role;
  privileges: { nodes: RolePrivilege[] };
}) {
  const [openEditor, setOpenEditor] = useState(false);
  const [rolePrivilegeEditor, setRolePrivilegeEditor] = useState(null);
  const rows =
    privileges?.nodes?.length > 0 ? (
      privileges.nodes.map((row) => (
        <Table.Tr key={`role-privilege-${row.id}`}>
          <Table.Td>{row.privilege.subject}</Table.Td>
          <Table.Td>{row.privilege.action}</Table.Td>
        </Table.Tr>
      ))
    ) : (
      <Table.Tr>
        <Table.Td colSpan={2}>
          No Privileges Assigned to {role.name?.toUpperCase()} Role
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
      <Title order={2}>{role.name?.toUpperCase()} Role Privileges</Title>
      {!openEditor && (
        <Box my={10}>
          <Button
            leftSection={<IconSquarePlus size={14} />}
            onClick={() => setOpenEditor(true)}
            variant="light"
            color="violet"
          >
            Assign Role Privileges
          </Button>
        </Box>
      )}
      {openEditor && (
        <Box my={10}>
          <RolePrivilegeEditor closeEditor={setOpenEditor} roleId={role.id} />
        </Box>
      )}
      <Table stickyHeader withTableBorder stickyHeaderOffset={60} miw={700}>
        <Table.Thead className={classes.header}>
          <Table.Tr>
            <Table.Th>Subject</Table.Th>
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Box>
  );
}
