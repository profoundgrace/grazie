import type { ActionFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { redirectWithToast } from 'remix-toast';
import { removeRolePrivilege } from '~/lib/rolePrivilege.server';
import { getSession } from '~/utils/session.server';

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const session = await getSession(request.headers.get('Cookie'));

  await removeRolePrivilege({
    id: Number(form.get('id') as string)
  });

  return redirectWithToast(`/dashboard/admin/roles`, {
    message: 'Role Privlege Deleted!',
    type: 'success'
  });
}
