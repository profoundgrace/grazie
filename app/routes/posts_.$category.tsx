import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { getPosts } from '~/lib/post.server';
import { site } from '@/grazie';
import { pagerParams } from '~/utils/searchParams.server';
import PostsList from '~/components/Post/PostsList';

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

export default PostsList;
