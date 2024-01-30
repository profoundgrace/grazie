import { LoaderFunctionArgs, json } from '@remix-run/node';
import RoleUsersLoaderWrapper from '~/components/RoleUser/RoleUsersLoaderWrapper';
import { getRoleUsers } from '~/lib/roleUser.server';

export async function loader({ params, request }: LoaderFunctionArgs) {
  const users = await getRoleUsers({
    roleId: Number(params.roleId)
  });
  console.log(users);
  return json({ _page: 'dashboard', users });
}

export default function RoleUserAdmin() {
  return <RoleUsersLoaderWrapper />;
}
