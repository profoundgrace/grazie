import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { json } from '@remix-run/node'; // or cloudflare/deno
import { redirectWithToast } from 'remix-toast';
import { updateCategory, getCategories } from '~/lib/category.server';
import { sentry } from '~/lib/sentry.server';
import { createAbility, getSession } from '~/utils/session.server';
import { site } from '@/grazie';

export function meta() {
  return [{ title: `Create Category${site?.separator}${site?.name}` }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'update', subject: 'Category' });
  const categories = await getCategories({});
  const data = { categories };

  return json(data);
}

export async function action({ request }: ActionFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  await sentry(request, { action: 'update', subject: 'Category' });
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

  return redirectWithToast(`/dashboard/admin/categories`, {
    message: 'Category Updated!',
    type: 'success'
  });
}
