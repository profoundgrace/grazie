/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { json } from '@remix-run/node'; // or cloudflare/deno
import { redirectWithToast } from 'remix-toast';
import { setting } from '~/lib/setting.server';
import { createAbility } from '~/utils/session.server';
import { site } from '@/grazie';
import { sentry } from '~/lib/sentry.server';

export function meta() {
  return [{ title: `Update Post${site?.separator}${site?.name}` }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, {
    action: 'create',
    subject: 'Setting'
  });
  const data = {};

  return json(data);
}

export async function action({ request }: ActionFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, {
    action: 'create',
    subject: 'Setting'
  });
  const form = await request.formData();

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
