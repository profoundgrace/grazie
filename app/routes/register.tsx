import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction
} from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { getSession, commitSession } from '~/utils/session.server';
import { Register } from '~/components/Register';
import { createUser } from '~/lib/user.server';
import { site } from '@/grazie';

export const meta: MetaFunction = () => {
  return [
    { title: `Create an Account${site?.separator}${site?.name}` },
    { name: 'description', content: 'Welcome!' }
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));

  if (session.has('userId')) {
    // Redirect to the home page if they are already signed in.
    return redirect('/');
  }

  const data = { error: session.get('error') };

  return json(data, {
    headers: {
      'Set-Cookie': await commitSession(session)
    }
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const form = await request.formData();
  const username = form.get('username') as string;
  const email = form.get('email') as string;
  const password = form.get('password') as string;

  const user = await createUser({ username, email, password });

  if (user?.id === null) {
    session.flash('error', 'Invalid username/password');

    // Redirect back to the login page with errors.
    return redirect('/login', {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    });
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
  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session)
    }
  });
}

export default function RegisterPage() {
  return <Register site={site} />;
}
