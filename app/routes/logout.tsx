import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirectWithToast } from 'remix-toast';
import { getSession, destroySession } from '~/utils/session.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));
  return redirectWithToast(
    '/login',
    { message: 'Logged Out!', type: 'success' },
    {
      headers: {
        'Set-Cookie': await destroySession(session)
      }
    }
  );
};
