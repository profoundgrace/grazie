import { getBooks } from '!~/lib/kjv.server';
import {
  ActionIcon,
  Button,
  Grid,
  Group,
  Tabs,
  TextInput,
  Title
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import {
  Form,
  type LoaderFunctionArgs,
  useLoaderData,
  useNavigate
} from 'react-router';
import { SEO } from '~/utils/meta';
import { createAbility } from '~/utils/session.server';

export function meta({ matches }: { matches: typeof loader }) {
  return SEO({
    title: `Holy Bible - New Testament`,
    matches
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  const books = await getBooks({ filter: { testament: 'nt' } });

  return { books };
}

export default function BibleNT() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const books = data?.books?.nodes;

  console.log(books);

  return (
    <Grid>
      <Grid.Col span={12}>
        <Title order={1}>Holy Bible</Title>
        <Grid my={10}>
          <Grid.Col span={{ base: 12, md: 4, lg: 3 }}>
            <Form method="GET" action="/bible/search">
              <TextInput
                name="q"
                placeholder="Search New Testament"
                rightSection={
                  <ActionIcon type="submit">
                    <IconSearch color="white" />
                  </ActionIcon>
                }
              />
            </Form>
          </Grid.Col>
        </Grid>
        <Tabs
          value="nt"
          keepMounted={false}
          onChange={(value) =>
            navigate(`/bible${value === 'all' ? '' : `/${value}`}`)
          }
        >
          <Tabs.List>
            <Tabs.Tab value="all">All</Tabs.Tab>
            <Tabs.Tab value="ot">Old Testament</Tabs.Tab>
            <Tabs.Tab value="nt">New Testament</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="nt">
            <Group my={10}>
              {books?.map((book) => (
                <Button
                  key={book.id}
                  variant="outline"
                  radius="sm"
                  size="sm"
                  component="a"
                  href={`/bible/${book.slug}`}
                >
                  {book.book}
                </Button>
              ))}
            </Group>
          </Tabs.Panel>
        </Tabs>
      </Grid.Col>
    </Grid>
  );
}
