/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction
} from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { redirectWithToast } from 'remix-toast';
import { getSession, commitSession } from '~/utils/session.server';
import { Login } from '~/components/Login';
import { userLogin } from '~/lib/user.server';
import { site } from '@/grazie';

export const meta: MetaFunction = () => {
  return [
    { title: `Login${site?.separator}${site?.name}` },
    { name: 'description', content: 'Welcome!' }
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));

  if (session.has('userId')) {
    // Redirect to the home page if they are already signed in.
    return redirect('/');
  }

  const data = {
    error: session.get('error')
  };

  return json(data, {
    headers: {
      'Set-Cookie': await commitSession(session)
    }
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const form = await request.formData();
  const email = form.get('email') as string;
  const password = form.get('password') as string;

  const user = await userLogin({ email, password });

  if (user?.id === null) {
    session.flash('error', 'Invalid username/password');

    // Redirect back to the login page with errors.
    return redirectWithToast(
      '/login',
      { message: 'Loggin Error!', type: 'error' },
      {
        headers: {
          'Set-Cookie': await commitSession(session)
        }
      }
    );
  }

  session.set('userId', user.id);
  session.set('isLoggedIn', true);
  session.set('userData', {
    name: user.username,
    settings: user?.settings ?? {},
    avatar: user?.avatar,
    _id: user._id
  });
  session.set('darkMode', user?.settings?.darkMode ?? false);

  // Login succeeded, send them to the home page.
  return redirectWithToast(
    '/',
    { message: 'Logged in Successfully!', type: 'success' },
    {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    }
  );
}

export default function LoginPage() {
  return <Login />;
}
