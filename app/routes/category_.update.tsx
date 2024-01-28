import { Title, Grid, Tabs } from '@mantine/core';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { json, redirect } from '@remix-run/node'; // or cloudflare/deno
import { useLoaderData, useNavigate } from '@remix-run/react';
import Editor from '~/components/Editor';
import { updateCategory, getCategories } from '~/lib/category.server';
import { getSession } from '~/utils/session.server';
import { site } from '@/grazie';

export function meta() {
  return [{ title: `Create Category${site?.separator}${site?.name}` }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const categories = await getCategories({});
  const data = { categories };

  return json(data);
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const session = await getSession(request.headers.get('Cookie'));
  const id = Number(form.get('id'));
  const name = form.get('name') as string;
  const description = form.get('description') as string;
  const parentId = form.get('parentId') as string;
  await updateCategory({
    id,
    name,
    description,
    parentId: parentId ? Number(parentId) : undefined
  });

  return redirect(`/dashboard/admin/categories`);
}
