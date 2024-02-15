import { LoaderFunctionArgs, json } from '@remix-run/node';
import { getComments } from '~/lib/comment.server';

export async function loader({ params, request }: LoaderFunctionArgs) {
  const postId = params?.postId;
  const url = new URL(request.url);
  const limit = url.searchParams.get('limit') ?? 5;
  const offset = url.searchParams.get('offset') ?? 5;
  const data = {
    comments: postId
      ? await getComments({
          filter: { postId: Number(postId) },
          sort: { field: 'path', order: 'asc' },
          limit: Number(limit),
          offset: Number(offset)
        })
      : []
  };
  return json(data);
}
