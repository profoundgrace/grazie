/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import UserAccount from '~/components/User/Account';
import { sentry } from '~/lib/sentry.server';
import { getUserAccount } from '~/lib/user.server';
import { createAbility, getUserId } from '~/utils/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const currentUserId = await getUserId(request);
  if (!request?.ability) {
    await createAbility(request);
  }
  const account = currentUserId ? await getUserAccount(currentUserId) : {};

  await sentry(request, {
    action: 'update',
    subject: 'User',
    item: account
  });

  const data = { account, _page: 'dashboard' };

  return json(data);
}

const Register = () => {
  const { account } = useLoaderData<typeof loader>();
  return <UserAccount account={account} />;
};

export default Register;
