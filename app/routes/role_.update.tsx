import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { json, redirect } from '@remix-run/node'; // or cloudflare/deno
import { updateRole } from '~/lib/role.server';
import { getSession } from '~/utils/session.server';
import { site } from '@/grazie';

export function meta() {
  return [{ title: `Update Role${site?.separator}${site?.name}` }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const data = {};

  return json(data);
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const session = await getSession(request.headers.get('Cookie'));

  await updateRole({
    id: Number(form.get('id') as string),
    active: form.get('active') === 'on' ? true : false,
    name: form.get('name') as string,
    description: form.get('description') as string
  });

  return redirect(`/dashboard/admin/roles`);
}
