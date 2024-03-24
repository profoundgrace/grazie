import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { json } from '@remix-run/node'; // or cloudflare/deno
import { redirectWithToast } from 'remix-toast';
import { createRoleUser } from '~/lib/roleUser.server';
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
  const users = form.get('userId') as string;

  for (const userId of users.split(',')) {
    await createRoleUser({
      active: form.get('active') === 'on' ? true : false,
      roleId: Number(form.get('roleId') as string),
      userId: Number(userId)
    });
  }

  return redirectWithToast(`/dashboard/admin/roles`, {
    message: 'Role User Created!',
    type: 'success'
  });
}
