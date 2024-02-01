import { LoaderFunctionArgs, json } from '@remix-run/node';
import RolePrivilegesLoaderWrapper from '~/components/RolePrivilege/RolePrivilegesLoaderWrapper';
import { getRolePrivileges } from '~/lib/rolePrivilege.server';

export async function loader({ params, request }: LoaderFunctionArgs) {
  const privileges = await getRolePrivileges({
    roleId: Number(params.roleId)
  });
  return json({ _page: 'dashboard', privileges });
}

export default function RolePrivilegeAdmin() {
  return <RolePrivilegesLoaderWrapper />;
}
