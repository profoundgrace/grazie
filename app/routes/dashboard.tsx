import { LoaderFunctionArgs, json } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { site } from '@/grazie';

export function meta() {
  return [{ title: `Dashboard${site?.separator}${site?.name}` }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  return json({ _page: 'dashboard' });
}

export default function Dashboard() {
  return <Outlet />;
}
