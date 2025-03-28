/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import type { LoaderFunctionArgs } from 'react-router';
import { Outlet } from 'react-router';
import { sentry } from '~/lib/sentry.server';
import { SEO } from '~/utils/meta';
import { createAbility } from '~/utils/session.server';

export function meta({ matches }: { matches: typeof loader }) {
  return SEO({ title: `Dashboard`, matches });
}

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'read', subject: 'Dashboard' });

  return { _page: 'dashboard' };
}

export default function Dashboard() {
  return <Outlet />;
}
