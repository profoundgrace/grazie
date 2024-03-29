import { LoaderFunctionArgs, json } from '@remix-run/node';
import { getComments } from '~/lib/comment.server';
import { sentry } from '~/lib/sentry.server';
import { createAbility } from '~/utils/session.server';

export async function loader({ params, request }: LoaderFunctionArgs) {
  const postId = params?.postId;
  const url = new URL(request.url);
  const limit = url.searchParams.get('limit') ?? 5;
  const offset = url.searchParams.get('offset') ?? 5;
  if (!request?.ability) {
    await createAbility(request);
  }
  const comments =
    postId &&
    (await getComments({
      filter: { postId: Number(postId) },
      sort: { field: 'path', order: 'asc' },
      limit: Number(limit),
      offset: Number(offset)
    }));

  await sentry(request, {
    action: 'read',
    subject: 'Comment',
    items: comments
  });
  const data = {
    comments: postId ? comments : []
  };
  return json(data);
}
