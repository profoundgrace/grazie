import { ActionIcon, Box, Button, Group, Table, Title } from '@mantine/core';
import { LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import {
  IconCheck,
  IconEdit,
  IconSquarePlus,
  IconUserShield,
  IconX
} from '@tabler/icons-react';
import { Fragment, useState } from 'react';
import classes from '~/components/Dashboard/AdminPost.module.css';
import PrivilegeEditor from '~/components/Privilege/Editor';
import { getPrivileges } from '~/lib/privilege.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const privileges = await getPrivileges({});
  return json({ _page: 'dashboard', privileges });
}

export default function UserAdmin() {
  const { privileges } = useLoaderData();
  const [openEditor, setOpenEditor] = useState(false);
  const [privilegeEditor, setPrivilegeEditor] = useState(null);

  const rows = privileges.nodes.map((row) => (
    <Fragment key={row.slug}>
      <Table.Tr
        bg={
          privilegeEditor === row.id ? 'var(--mantine-color-dark-9)' : undefined
        }
      >
        <Table.Td>{row.id}</Table.Td>
        <Table.Td>{row.subject}</Table.Td>
        <Table.Td>{row.action}</Table.Td>
        <Table.Td>
          <Group>
            <ActionIcon
              variant="subtle"
              radius="md"
              aria-label="Privilege Editor"
              onClick={() => setPrivilegeEditor(row.id)}
            >
              <IconEdit style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>
      {privilegeEditor === row.id && (
        <Table.Tr bg={'var(--mantine-color-dark-5)'}>
          <Table.Td colSpan={4}>
            <PrivilegeEditor closeEditor={setPrivilegeEditor} {...row} />
          </Table.Td>
        </Table.Tr>
      )}
    </Fragment>
  ));

  return (
    <>
      <Title>Privileges</Title>
      {!openEditor && (
        <Box my={10}>
          <Button
            leftSection={<IconSquarePlus size={14} />}
            onClick={() => setOpenEditor(true)}
            variant="light"
          >
            New Privilege
          </Button>
        </Box>
      )}
      {openEditor && (
        <Box my={10}>
          <PrivilegeEditor closeEditor={setOpenEditor} />
        </Box>
      )}

      <Table stickyHeader striped stickyHeaderOffset={60} miw={700}>
        <Table.Thead className={classes.header}>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Subject</Table.Th>
            <Table.Th>Action</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
}