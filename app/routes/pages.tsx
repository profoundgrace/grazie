import { Title, Grid, Tabs } from '@mantine/core';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import PageCard from '~/components/Page/PageCard';
import { getPages } from '~/lib/page.server';
import { site } from '@/grazie';
import { subject, useAbility } from '~/hooks/useAbility';
import Pager from '~/components/Pager/Pager';
import { pagerParams } from '~/utils/searchParams.server';
import { createAbility } from '~/utils/session.server';
import { sentry } from '~/lib/sentry.server';

export function meta() {
  return [{ title: `Pages${site?.separator}${site?.name}` }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { count, page, pagerLoader } = pagerParams(request, 25);

  const query = {
    limit: count,
    offset: page ? (page - 1) * count : 0
  };
  const pages = await getPages(query);
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, {
    action: 'read',
    subject: 'Page',
    items: pages
  });
  const data = { pages, pager: pagerLoader(pages.totalCount) };

  return json(data);
}

export default function Pages() {
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
              image: `${data?.pages?.avatarURL}sm/${article?.author?.avatar}`
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
            {ability.can('create', subject('Page', {})) && (
              <Tabs.Tab value="create" onClick={() => navigate('/page/create')}>
                Create
              </Tabs.Tab>
            )}
            <Tabs.Tab value="browse">Browse</Tabs.Tab>
          </Tabs.List>
          <Pager />
          <Tabs.Panel value="browse" py={10}>
            {pages}
          </Tabs.Panel>
          <Pager />
        </Tabs>
      </Grid.Col>
    </Grid>
  );
}
