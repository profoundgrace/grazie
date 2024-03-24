import { Title, Grid, Tabs } from '@mantine/core';
import type { LoaderFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { json } from '@remix-run/node'; // or cloudflare/deno
import { useNavigate } from '@remix-run/react';

import Editor from '~/components/Editor';
import { getCategories } from '~/lib/category.server';
import { getPost } from '~/lib/post.server';
import { createAbility } from '~/utils/session.server';
import { site } from '@/grazie';
import { useAbility } from '~/hooks/useAbility';
import { subject } from '@casl/ability';
import { sentry } from '~/lib/sentry.server';

export function meta({
  data: {
    post: { title }
  }
}) {
  return [
    { title: `${title}${site?.separator}Edit${site?.separator}${site?.name}` }
  ];
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const categories = await getCategories({});
  const post = await getPost({ slug: params.slug });

  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'update', subject: 'Post', object: post });
  const data = { categories, post, _page: 'post' };
  return json(data);
}

export default function ArticlesCreate() {
  const ability = useAbility();
  const navigate = useNavigate();

  return (
    <Grid>
      <Grid.Col span={12}>
        <Title order={2}>Posts</Title>
        <Tabs defaultValue="editor" keepMounted={false}>
          <Tabs.List>
            {ability.can('create', subject('Post', {})) && (
              <Tabs.Tab value="create" onClick={() => navigate('/post/create')}>
                Create
              </Tabs.Tab>
            )}

            <Tabs.Tab value="browse" onClick={() => navigate('/posts')}>
              Browse
            </Tabs.Tab>
            <Tabs.Tab value="editor">Edit</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="editor" py={10}>
            <Editor post />
          </Tabs.Panel>
        </Tabs>
      </Grid.Col>
    </Grid>
  );
}
