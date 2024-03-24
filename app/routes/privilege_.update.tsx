import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { json } from '@remix-run/node'; // or cloudflare/deno
import { updatePrivilege } from '~/lib/privilege.server';
import { getSession } from '~/utils/session.server';
import { site } from '@/grazie';
import { redirectWithToast } from 'remix-toast';

export function meta() {
  return [{ title: `Update Privilege${site?.separator}${site?.name}` }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const data = {};

  return json(data);
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const session = await getSession(request.headers.get('Cookie'));

  await updatePrivilege({
    id: Number(form.get('id') as string),
    subject: form.get('subject') as string,
    action: form.get('action') as string
  });

  return redirectWithToast(`/dashboard/admin/privileges`, {
    message: 'Privilege Updated!',
    type: 'success'
  });
}
