import { Title, Grid, Tabs } from '@mantine/core';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import type { Page } from '~/types/Page';
import PageCard from '~/components/Page/PageCard';
import { getPage } from '~/lib/page.server';
import { site } from '@/grazie';

export function meta({
  data: {
    page: { title }
  }
}) {
  return [{ title: `${title}${site?.separator}${site?.name}` }];
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const page = await getPage({ slug: params?.slug });

  const data = { page };
  return json(data);
}

export default function Page() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { page } = data;

  return (
    <Grid>
      <Grid.Col span={12}>
        <PageCard
          key={page.id}
          data={{
            ...page,
            body: JSON.parse(page.body),
            author: {
              name: page?.author?.displayName,
              description: '',
              image: `${page?.avatarURL}sm/${page?.author?.avatar}`
            }
          }}
        />
      </Grid.Col>
    </Grid>
  );
}
