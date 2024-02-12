import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { createComment } from '~/lib/comment.server';
import { sentry } from '~/lib/sentry.server';
import { createAbility, getSession } from '~/utils/session.server';

export async function action({ params, request }: ActionFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'create', subject: 'Comment' });
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
