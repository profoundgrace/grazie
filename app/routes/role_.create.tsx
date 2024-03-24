import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { json } from '@remix-run/node'; // or cloudflare/deno
import { redirectWithToast } from 'remix-toast';
import { createRole } from '~/lib/role.server';
import { getSession } from '~/utils/session.server';
import { site } from '@/grazie';

export function meta() {
  return [{ title: `Create Role${site?.separator}${site?.name}` }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const data = {};

  return json(data);
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const session = await getSession(request.headers.get('Cookie'));

  await createRole({
    active: form.get('active') === 'on' ? true : false,
    name: form.get('name') as string,
    description: form.get('description') as string
  });

  return redirectWithToast(`/dashboard/admin/roles`, {
    message: 'Role Created!',
    type: 'success'
  });
}
