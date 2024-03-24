import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { json } from '@remix-run/node'; // or cloudflare/deno
import { redirectWithToast } from 'remix-toast';
import { setting } from '~/lib/setting.server';
import { getSession } from '~/utils/session.server';
import { site } from '@/grazie';

export function meta() {
  return [{ title: `Update Post${site?.separator}${site?.name}` }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const data = {};

  return json(data);
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const session = await getSession(request.headers.get('Cookie'));

  await setting({
    name: form.get('name') as string,
    value: form.get('value') as string,
    type: form.get('type') as string
  });

  return redirectWithToast(`/dashboard/admin/settings`, {
    message: 'Setting Created!',
    type: 'success'
  });
}
