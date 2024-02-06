import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { createComment } from '~/lib/comment.server';
import { getSession } from '~/utils/session.server';

export async function action({ params, request }: ActionFunctionArgs) {
  const form = await request.formData();
  const session = await getSession(request.headers.get('Cookie'));
  const authorId = session.get('userId') as number;
  const postId = Number(form.get('postId') as string);
  const parentId = form.get('parentId') as string;
  const locked = form.get('locked') === 'on' ? true : false;
  const pinned = form.get('pinned') === 'on' ? true : false;

  await createComment({
    postId,
    parentId: parentId ? Number(parentId) : null,
    authorId,
    locked,
    pinned,
    body: form.get('body') as string
  });

  return redirect(`/post/${params.slug}`);
}
