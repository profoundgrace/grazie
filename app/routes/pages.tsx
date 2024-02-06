import { Title, Grid, Tabs } from '@mantine/core';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import type { Page } from '~/types/Page';
import PageCard from '~/components/Page/PageCard';
import { getPages } from '~/lib/page.server';
import { site } from '@/grazie';
import { Can } from '~/components/Can';
import { useAbility } from '~/hooks/useAbility';
import { subject } from '@casl/ability';

export function meta() {
  return [{ title: `Pages${site?.separator}${site?.name}` }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const pages = await getPages({});

  const data = { pages };

  return json(data);
}

export default function Articles() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const ability = useAbility();

  const pages =
    data?.pages?.nodes?.length > 0 ? (
      data?.pages?.nodes?.map((article) => (
        <PageCard
          key={article.id}
          data={{
            ...article,
            body: JSON.parse(article.body),
            category: null,
            author: {
              name: article?.author?.displayName,
              description: '',
              image: ''
            }
          }}
        />
      ))
    ) : (
      <h4>No Pages Stored</h4>
    );

  return (
    <Grid>
      <Grid.Col span={12}>
        <Title order={2}>Pages</Title>
        <Tabs defaultValue="browse" keepMounted={false}>
          <Tabs.List>
            {ability.can('create', subject('Post', {})) && (
              <Tabs.Tab value="create" onClick={() => navigate('/page/create')}>
                Create
              </Tabs.Tab>
            )}
            <Tabs.Tab value="browse">Browse</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="browse" py={10}>
            {pages}
          </Tabs.Panel>
        </Tabs>
      </Grid.Col>
    </Grid>
  );
}
