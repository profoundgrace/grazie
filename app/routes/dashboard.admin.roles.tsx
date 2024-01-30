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
import RoleEditor from '~/components/Role/Editor';
import RoleUsersWrapper from '~/components/RoleUser/RoleUsersFetcherWrapper';
import { getRoles } from '~/lib/role.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const roles = await getRoles({});
  return json({ _page: 'dashboard', roles });
}

export default function UserAdmin() {
  const { roles } = useLoaderData();
  const [openEditor, setOpenEditor] = useState(false);
  const [roleEditor, setRoleEditor] = useState(null);
  const [roleUsers, setRoleUsers] = useState(null);

  const rows = roles.nodes.map((row) => (
    <Fragment key={row.slug}>
      <Table.Tr
        bg={
          roleEditor === row.id || roleUsers === row.id
            ? 'var(--mantine-color-dark-9)'
            : undefined
        }
      >
        <Table.Td>{row.id}</Table.Td>
        <Table.Td>{row.name}</Table.Td>
        <Table.Td>
          {row.active ? <IconCheck color="green" /> : <IconX color="red" />}
        </Table.Td>
        <Table.Td>{row.description}</Table.Td>
        <Table.Td>
          <Group>
            <ActionIcon
              variant="subtle"
              radius="md"
              aria-label="Role Editor"
              onClick={() => setRoleEditor(row.id)}
            >
              <IconEdit style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
            <ActionIcon
              color="gold"
              variant="subtle"
              radius="md"
              aria-label="Role Users"
              onClick={() => setRoleUsers(row.id)}
            >
              <IconUserShield
                style={{ width: '70%', height: '70%' }}
                stroke={1.5}
              />
            </ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>
      {roleEditor === row.id && (
        <Table.Tr bg={'var(--mantine-color-dark-5)'}>
          <Table.Td colSpan={5}>
            <RoleEditor closeEditor={setRoleEditor} {...row} />
          </Table.Td>
        </Table.Tr>
      )}
      {roleUsers === row.id && (
        <Table.Tr bg={'var(--mantine-color-dark-5)'}>
          <Table.Td colSpan={5}>
            <RoleUsersWrapper role={row} />
          </Table.Td>
        </Table.Tr>
      )}
    </Fragment>
  ));

  return (
    <>
      <Title>Roles</Title>
      {!openEditor && (
        <Box my={10}>
          <Button
            leftSection={<IconSquarePlus size={14} />}
            onClick={() => setOpenEditor(true)}
            variant="light"
          >
            New Role
          </Button>
        </Box>
      )}
      {openEditor && (
        <Box my={10}>
          <RoleEditor closeEditor={setOpenEditor} />
        </Box>
      )}

      <Table stickyHeader striped stickyHeaderOffset={60} miw={700}>
        <Table.Thead className={classes.header}>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Active</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
}
