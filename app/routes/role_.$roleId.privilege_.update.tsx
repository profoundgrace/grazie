import type { ActionFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { redirectWithToast } from 'remix-toast';
import { updateRolePrivilege } from '~/lib/rolePrivilege.server';
import { getSession } from '~/utils/session.server';

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const session = await getSession(request.headers.get('Cookie'));
  const inverted = form.get('inverted') === 'on' ? true : false;
  await updateRolePrivilege({
    id: Number(form.get('id') as string),
    inverted,
    conditions: form.get('conditions') as string,
    description: form.get('description') as string
  });

  return redirectWithToast(`/dashboard/admin/roles`, {
    message: 'Role Privilege Updated!',
    type: 'success'
  });
}
