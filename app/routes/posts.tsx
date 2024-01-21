import { Title, Grid, Tabs } from '@mantine/core';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import type { Post } from '~/types/Post';
import PostCard from '~/components/Post/PostCard';
import { getPosts } from '~/lib/post.server';
import { site } from '@/grazie';

export function meta() {
  return [{ title: `Posts${site?.separator}${site?.name}` }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const posts = await getPosts({});

  const data = { posts };

  return json(data);
}

export default function Articles() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const posts =
    data?.posts?.nodes?.length > 0 ? (
      data?.posts?.nodes?.map((article) => (
        <PostCard
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
      <h4>No Posts Stored</h4>
    );

  return (
    <Grid>
      <Grid.Col span={12}>
        <Title order={2}>Posts</Title>
        <Tabs defaultValue="browse" keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab value="create" onClick={() => navigate('/posts/create')}>
              Create
            </Tabs.Tab>
            <Tabs.Tab value="browse">Browse</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="browse" py={10}>
            {posts}
          </Tabs.Panel>
        </Tabs>
      </Grid.Col>
    </Grid>
  );
}
