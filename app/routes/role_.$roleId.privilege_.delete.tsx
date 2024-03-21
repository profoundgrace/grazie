import type { ActionFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { redirect } from '@remix-run/node'; // or cloudflare/deno
import { removeRolePrivilege } from '~/lib/rolePrivilege.server';
import { getSession } from '~/utils/session.server';

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const session = await getSession(request.headers.get('Cookie'));

  await removeRolePrivilege({
    id: Number(form.get('id') as string)
  });

  return redirect(`/dashboard/admin/roles`);
}
