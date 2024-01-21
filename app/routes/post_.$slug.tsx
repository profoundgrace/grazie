import { Title, Grid, Tabs } from '@mantine/core';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import type { Post } from '~/types/Post';
import PostCard from '~/components/Post/PostCard';
import { getPost } from '~/lib/post.server';
import { site } from '@/grazie';

export function meta() {
  return [{ title: `Posts${site?.separator}${site?.name}` }];
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const post = await getPost({ slug: params?.slug });

  const data = { post };
  console.log(post);
  return json(data);
}

export default function Post() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { post } = data;

  return (
    <Grid>
      <Grid.Col span={12}>
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
      </Grid.Col>
    </Grid>
  );
}
