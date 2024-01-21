import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { json, redirect } from '@remix-run/node'; // or cloudflare/deno
import { updatePost } from '~/lib/post.server';
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
  const userId = session.get('userId') as string;

  const article = await updatePost({
    id: form.get('id') as string,
    articleTypeId: form.get('articleTypeId') as string,
    createdAt: form.get('createdAt') as string,
    status: form.get('status') as string,
    summary: form.get('summary') as string,
    text: JSON.parse(form.get('text') as string),
    title: form.get('title') as string,
    userId
  });

  if (article?.slug) {
    return redirect(`/articles`);
  } else return article;
}
