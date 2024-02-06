import { Title, Grid, Tabs } from '@mantine/core';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import type { Post } from '~/types/Post';
import PostCard from '~/components/Post/PostCard';
import { getPost } from '~/lib/post.server';
import { site } from '@/grazie';
import { getComments } from '~/lib/comment.server';
import { CommentCard } from '~/components/Comment/CommentCard';
import { CommentList } from '~/components/Comment/CommentList';

export function meta({
  data: {
    post: { title }
  }
}) {
  return [{ title: `${title}${site?.separator}${site?.name}` }];
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const post = await getPost({ slug: params?.slug });

  const data = {
    post,
    comments: await getComments({ filter: { postId: post.id } })
  };
  return json(data);
}

export default function Post() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const { post, comments } = data;

  return (
    <Grid>
      <Grid.Col span={12}>
        <PostCard
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
      <Grid.Col span={12}>
        <CommentList postId={post.id} data={comments} />
      </Grid.Col>
    </Grid>
  );
}
