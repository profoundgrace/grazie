/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { ActionFunctionArgs } from '@remix-run/node';
import { jsonWithToast } from 'remix-toast';
import { createOrRemoveBookmark, getPost } from '~/lib/post.server';
import { sentry } from '~/lib/sentry.server';
import { createAbility, getSession } from '~/utils/session.server';

export async function action({ request }: ActionFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }
  const data = await request.json();
  const { postId } = data;

  if (postId) {
    const post = getPost({ id: postId });
    await sentry(request, { action: 'read', subject: 'Post', item: post });
    const session = await getSession(request.headers.get('Cookie'));

    const userId = session.get('userId') as number;
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
