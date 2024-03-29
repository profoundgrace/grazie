import { ActionFunctionArgs } from '@remix-run/node';
import { jsonWithToast } from 'remix-toast';

import { createOrRemoveFavorite, getPost } from '~/lib/post.server';
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
    const favorite = await createOrRemoveFavorite({
      userId,
      postId
    });
    if (favorite?.created) {
      return jsonWithToast(favorite, {
        message: `Favorite Created!`,
        type: 'success'
      });
    } else if (favorite?.removed) {
      return jsonWithToast(favorite, {
        message: `Favorite Removed!`,
        type: 'success'
      });
    } else {
      return jsonWithToast(favorite, {
        message: `Favorite Error!`,
        type: 'error'
      });
    }
  } else {
    return jsonWithToast({}, { message: `Favorite Error!`, type: 'error' });
  }
}
