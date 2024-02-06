import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import UserAccount from '~/components/User/Account';
import { getUserAccount } from '~/lib/user.server';
import { getUserId } from '~/utils/session.server';

export async function loader({ params, request }: LoaderFunctionArgs) {
  const currentUserId = await getUserId(request);
  const account = await getUserAccount(currentUserId);
  const data = { account, _page: 'dashboard' };

  return json(data);
}

const Register = () => {
  const { account } = useLoaderData<typeof loader>();
  return <UserAccount account={account} />;
};

export default Register;
