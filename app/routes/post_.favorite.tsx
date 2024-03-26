import { ActionFunctionArgs } from '@remix-run/node';
import { jsonWithToast } from 'remix-toast';

import { createOrRemoveFavorite } from '~/lib/post.server';
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
