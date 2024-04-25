/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { Grid } from '@mantine/core';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import type { Page } from '~/types/Page';
import PageCard from '~/components/Page/PageCard';
import { getPage } from '~/lib/page.server';
import { site } from '@/grazie';
import { createAbility } from '~/utils/session.server';
import { sentry } from '~/lib/sentry.server';

export function meta({
  data: {
    page: {
      createdAt,
      title,
      meta,
      publishedAt,
      author: { displayName }
    }
  }
}) {
  if (meta && typeof meta === 'string') {
    meta = JSON.parse(meta);
  }
  return [
    {
      title: `${meta?.seo?.title ?? title ?? ''}${site?.separator}${site?.name}`
    },
    {
      name: 'description',
      content: `${meta?.seo?.description}`
    },
    { keywords: meta?.seo?.keywords },
    {
      property: 'og:title',
      content: meta?.seo?.title ?? title ?? 'Untitled Post'
    },
    { property: 'og:type', content: 'article' },
    { name: 'author', property: 'og:author', content: displayName },
    {
      property: 'og:published_time',
      content: publishedAt ?? createdAt
    },
    { property: 'og:image', content: meta?.seo?.image },
    { property: 'og:description', content: meta?.seo?.description }
  ];
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  const page = await getPage({ slug: params?.slug });
  if (page) {
    await sentry(request, { action: 'read', subject: 'Page', item: page });
  }

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
