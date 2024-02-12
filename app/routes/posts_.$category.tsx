import { Title, Grid, Tabs } from '@mantine/core';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import type { Post } from '~/types/Post';
import PostCard from '~/components/Post/PostCard';
import { getPosts } from '~/lib/post.server';
import { site } from '@/grazie';
import { pagerParams } from '~/utils/searchParams.server';
import Pager from '~/components/Pager/Pager';

export function meta() {
  return [{ title: `Posts${site?.separator}${site?.name}` }];
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { count, page, pagerLoader } = pagerParams(request, 25);

  const query = {
    filter: { category: params.category },
    limit: count,
    offset: page ? (page - 1) * count : 0
  };
  const posts = await getPosts(query);

  const data = { posts, pager: pagerLoader(posts.totalCount) };

  return json(data);
}

export default function PostsCategory() {
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
              image: `${data?.posts?.avatarURL}sm/${post?.author?.avatar}`
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
            <Tabs.Tab value="create" onClick={() => navigate('/post/create')}>
              Create
            </Tabs.Tab>
            <Tabs.Tab value="browse">Browse</Tabs.Tab>
          </Tabs.List>
          <Pager />
          <Tabs.Panel value="browse" py={10}>
            {posts}
          </Tabs.Panel>
          <Pager />
        </Tabs>
      </Grid.Col>
    </Grid>
  );
}
