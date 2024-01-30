import { ActionIcon, Box, Button, Group, Table, Title } from '@mantine/core';
import { LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import {
  IconArrowUpRight,
  IconEdit,
  IconSquarePlus
} from '@tabler/icons-react';
import { Fragment, useState } from 'react';
import classes from '~/components/Dashboard/AdminPost.module.css';
import DateTime from '~/components/DateTime';
import PageEditor from '~/components/Page/Editor';
import { getPages } from '~/lib/page.server';
import { Page } from '~/types/Page';

export async function loader({ request }: LoaderFunctionArgs) {
  const pages = await getPages({});
  return json({ _page: 'dashboard', pages });
}

export default function PageAdmin() {
  const { pages } = useLoaderData();
  const [openEditor, setOpenEditor] = useState(false);
  const [pageEditor, setPageEditor] = useState(null);
  const navigate = useNavigate();

  const rows =
    pages?.nodes?.length > 0 ? (
      pages.nodes.map((row: Page) => (
        <Fragment key={row.slug}>
          <Table.Tr>
            <Table.Td>{row.id}</Table.Td>
            <Table.Td>{row.title}</Table.Td>
            <Table.Td>{row.published ? 'Published' : 'Draft'}</Table.Td>
            <Table.Td>{row.summary}</Table.Td>
            <Table.Td>
              <DateTime timestamp={row.createdAt} />
            </Table.Td>
            <Table.Td>{row.slug}</Table.Td>
            <Table.Td>
              <Group>
                <ActionIcon
                  variant="subtle"
                  radius="md"
                  aria-label="Edit Page"
                  onClick={() => setPageEditor(row.id)}
                >
                  <IconEdit
                    style={{ width: '70%', height: '70%' }}
                    stroke={1.5}
                  />
                </ActionIcon>
                <ActionIcon
                  color="green"
                  variant="subtle"
                  radius="md"
                  aria-label="View"
                  onClick={() => navigate(`/page/${row.slug}`)}
                >
                  <IconArrowUpRight
                    style={{ width: '70%', height: '70%' }}
                    stroke={1.5}
                  />
                </ActionIcon>
              </Group>
            </Table.Td>
          </Table.Tr>
          {pageEditor === row.id && (
            <Table.Tr>
              <Table.Td colSpan={7}>
                <PageEditor closeEditor={setPageEditor} {...row} />
              </Table.Td>
            </Table.Tr>
          )}
        </Fragment>
      ))
    ) : (
      <Table.Tr>
        <Table.Td colSpan={7}>No pages have been created!</Table.Td>
      </Table.Tr>
    );

  return (
    <>
      <Title>Pages</Title>
      {!openEditor && (
        <Box my={10}>
          <Button
            leftSection={<IconSquarePlus size={14} />}
            onClick={() => setOpenEditor(true)}
            variant="light"
          >
            New Page
          </Button>
        </Box>
      )}
      {openEditor && (
        <Box my={10}>
          <PageEditor closeEditor={setOpenEditor} />
        </Box>
      )}
      <Table stickyHeader striped stickyHeaderOffset={60} miw={700}>
        <Table.Thead className={classes.header}>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Title</Table.Th> <Table.Th>Status</Table.Th>
            <Table.Th>Summary</Table.Th>
            <Table.Th>Created</Table.Th>
            <Table.Th>Slug</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
}
