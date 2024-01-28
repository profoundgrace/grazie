import { Title, Grid, Tabs } from '@mantine/core';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { json, redirect } from '@remix-run/node'; // or cloudflare/deno
import { useLoaderData, useNavigate } from '@remix-run/react';
import { getUnixTime } from 'date-fns';
import Editor from '~/components/Editor';
import { getCategories, postCategory } from '~/lib/category.server';
import { getPost } from '~/lib/post.server';
import { getSession } from '~/utils/session.server';
import { site } from '@/grazie';

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
  const data = { categories, post };

  return json(data);
}

export default function ArticlesCreate() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Grid>
      <Grid.Col span={12}>
        <Title order={2}>Posts</Title>
        <Tabs defaultValue="editor" keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab value="create" onClick={() => navigate('/post/create')}>
              Create
            </Tabs.Tab>
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
