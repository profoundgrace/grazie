/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { Grid } from '@mantine/core';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import Page from '~/components/Page/Page';
import { getPage } from '~/lib/page.server';
import { SEO } from '~/utils/meta';
import { createAbility } from '~/utils/session.server';
import { sentry } from '~/lib/sentry.server';
import { Page as PageType } from '~/types/Page';

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
}: {
  data: { page: PageType };
}) {
  return SEO({
    createdAt,
    title,
    meta,
    publishedAt,
    author: displayName
  });
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

export default function PageView() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { page } = data;

  return (
    <Grid>
      <Grid.Col span={12}>
        <Page
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
