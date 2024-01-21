import { createCookieSessionStorage, redirect } from '@remix-run/node';
import { session as config } from '~/utils/config.server';
import type { User } from '~/types/User';
import { getUserById } from '~/lib/user.server';

const { name, maxAge, secrets, secure } = config;

type SessionData = {
  userId: number | null;
  isLoggedIn: boolean;
  userData?: {
    name: string;
    settings?: any | object;
    avatar?: string | null;
    _id?: string | null;
  };
  darkMode?: boolean;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: name ?? '__session',
      httpOnly: true,
      maxAge,
      path: '/',
      sameSite: 'lax',
      secrets: secrets ?? ['s3cret1'],
      secure
    }
  });

export async function getUserId(request: Request): Promise<User['id']> {
  const session = await getSession(request.headers.get('Cookie'));
  const userId = session.get('userId');

  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (userId === undefined) return null;

  const user = await getUserById(userId);

  if (user) return user;

  throw await logout(request);
}

export async function logout(request: Request) {
  const session = await getSession(request.headers.get('Cookie'));
  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session)
    }
  });
}

export { getSession, commitSession, destroySession };
