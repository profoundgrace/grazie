/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { LoaderFunctionArgs, json } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { site } from '@/grazie';
import { sentry } from '~/lib/sentry.server';
import { createAbility } from '~/utils/session.server';

export function meta() {
  return [{ title: `Dashboard${site?.separator}${site?.name}` }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'read', subject: 'Dashboard' });

  return json({ _page: 'dashboard' });
}

export default function Dashboard() {
  return <Outlet />;
}
