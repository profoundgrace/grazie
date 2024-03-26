import { ActionFunctionArgs } from '@remix-run/node';
import { jsonWithToast } from 'remix-toast';
import { createOrRemoveBookmark } from '~/lib/post.server';
import { sentry } from '~/lib/sentry.server';
import { createAbility, getSession } from '~/utils/session.server';

export async function action({ request }: ActionFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }
  const data = await request.json();
  await sentry(request, { action: 'create', subject: 'Comment' });
  const session = await getSession(request.headers.get('Cookie'));
  const { postId } = data;
  const userId = session.get('userId') as number;

  if (postId) {
    const bookmark = await createOrRemoveBookmark({
      userId,
      postId
    });
    if (bookmark?.created) {
      return jsonWithToast(bookmark, {
        message: `Bookmark Created!`,
        type: 'success'
      });
    } else if (bookmark?.removed) {
      return jsonWithToast(bookmark, {
        message: `Bookmark Removed!`,
        type: 'success'
      });
    } else {
      return jsonWithToast(bookmark, {
        message: `Bookmark Error!`,
        type: 'error'
      });
    }
  } else {
    return jsonWithToast({}, { message: `Bookmark Error!`, type: 'error' });
  }
}
