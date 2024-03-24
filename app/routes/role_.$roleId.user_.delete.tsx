import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { json } from '@remix-run/node'; // or cloudflare/deno
import { redirectWithToast } from 'remix-toast';
import { removeRoleUser } from '~/lib/roleUser.server';
import { getSession } from '~/utils/session.server';
import { site } from '@/grazie';
import { getUsers } from '~/lib/user.server';

export function meta() {
  return [{ title: `Create Role${site?.separator}${site?.name}` }];
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const users = await getUsers({
    filter: { not: { roleId: Number(params.roleId) } },
    select: { id: true, username: true }
  });
  const data = { users };

  return json(data);
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const session = await getSession(request.headers.get('Cookie'));

  await removeRoleUser({
    id: Number(form.get('id') as string)
  });

  return redirectWithToast(`/dashboard/admin/roles`, {
    message: 'Role User Deleted!',
    type: 'success'
  });
}
