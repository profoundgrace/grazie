import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { json, redirect } from '@remix-run/node'; // or cloudflare/deno
import { getUnixTime } from 'date-fns';
import { updatePage } from '~/lib/page.server';
import { getSession } from '~/utils/session.server';
import { site } from '@/grazie';

export function meta() {
  return [{ title: `Update Page${site?.separator}${site?.name}` }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const data = {};

  return json(data);
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const session = await getSession(request.headers.get('Cookie'));
  const id = Number(form.get('id') as string);
  const published = form.get('published') === 'on' ? true : false;
  const publishedAt = form.get('publishedAt') as string;
  const slugFormat = form.get('slugFormat') as string;
  const slug = form.get('slug') as string;

  const page = await updatePage({
    id,
    published,
    publishedAt: getUnixTime(new Date(publishedAt)),
    body: form.get('body') as string,
    title: form.get('title') as string,
    summary: form.get('summary') as string,
    slugFormat,
    slug
  });

  if (page?.slug) {
    return redirect(`/page/${page.slug}`);
  } else return page;
}
