import { json, LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { getPosts } from '~/lib/post.server';
import { site, metaSettings } from '@/grazie';
import { useLoaderData, useNavigate } from '@remix-run/react';
import PostCard from '~/components/Post/PostCard';
import { Grid, Tabs } from '@mantine/core';

export const meta: MetaFunction = () => {
  return [
    {
      title: metaSettings?.home?.title ?? site?.name ?? 'New Remix App'
    },
    {
      name: 'description',
      content: site?.description ?? 'Welcome to Remix!'
    }
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const posts = await getPosts({});

  const data = { posts };

  return json(data);
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const posts =
    data?.posts?.nodes?.length > 0 ? (
      data?.posts?.nodes?.map((post) => (
        <PostCard
          key={post.id}
          data={{
            ...post,
            body: JSON.parse(post.body),
            author: {
              name: post?.author?.displayName,
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
        <Tabs defaultValue="browse" keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab value="create" onClick={() => navigate('/post/create')}>
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
