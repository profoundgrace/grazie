import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { json } from '@remix-run/node'; // or cloudflare/deno
import { redirectWithToast } from 'remix-toast';
import { createRolePrivilege } from '~/lib/rolePrivilege.server';
import { getSession } from '~/utils/session.server';
import { site } from '@/grazie';
import { getPrivileges } from '~/lib/privilege.server';

export function meta() {
  return [{ title: `Create Role${site?.separator}${site?.name}` }];
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const privileges = await getPrivileges({
    filter: { not: { roleId: Number(params.roleId) } },
    select: { id: true, privilegename: true }
  });
  const data = { privileges };

  return json(data);
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const session = await getSession(request.headers.get('Cookie'));
  const inverted = form.get('inverted') === 'on' ? true : false;
  await createRolePrivilege({
    roleId: Number(form.get('roleId') as string),
    privilegeId: Number(form.get('privilegeId')),
    inverted,
    conditions: form.get('conditions') as string,
    description: form.get('description') as string
  });

  return redirectWithToast(`/dashboard/admin/roles`, {
    message: 'Role Privilege Created!',
    type: 'success'
  });
}
