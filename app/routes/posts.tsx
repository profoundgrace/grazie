import type { LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { getPosts } from '~/lib/post.server';
import { site } from '@/grazie';
import { pagerParams } from '~/utils/searchParams.server';
import PostsList from '~/components/Post/PostsList';
import { createAbility, getSession } from '~/utils/session.server';
import { sentry } from '~/lib/sentry.server';

export function meta() {
  return [{ title: `Posts${site?.separator}${site?.name}` }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }
  const { count, page, pagerLoader } = pagerParams(request, 25);
  const session = await getSession(request.headers.get('Cookie'));
  const userId = session.get('userId') as number;
  const query = {
    filter: { published: true },
    limit: count,
    offset: page ? (page - 1) * count : 0
  };
  const posts = await getPosts(query, userId);

  if (
    !(await sentry(
      request,
      {
        action: 'read',
        subject: 'Post',
        object: { published: true }
      },
      // Prevents 404 error
      { reject: false }
    ))
  ) {
    return redirect('/login');
  }

  const data = { posts, pager: pagerLoader(posts.totalCount) };

  return json(data);
}

export default PostsList;
