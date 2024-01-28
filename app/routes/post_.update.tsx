import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { json, redirect } from '@remix-run/node'; // or cloudflare/deno
import { getUnixTime } from 'date-fns';
import { postCategory, purgePostCategories } from '~/lib/category.server';
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
  const id = Number(form.get('id') as string);
  const published = form.get('published') === 'on' ? true : false;
  const publishedAt = form.get('publishedAt') as string;
  const slugFormat = form.get('slugFormat') as string;
  const slug = form.get('slug') as string;

  const post = await updatePost({
    id,
    published,
    publishedAt: getUnixTime(new Date(publishedAt)),
    body: form.get('body') as string,
    title: form.get('title') as string,
    slugFormat,
    slug
  });

  const categories = form.get('categories') as string;
  // Delete Post's Categories
  await purgePostCategories({ postId: id });
  // Assign Current Categories
  if (categories) {
    const cats = categories.split(',');

    for (const cat of cats) {
      // Prefer to use 'slug', but TagsInput displays the 'value' as the 'label', so we use 'name' here
      await postCategory({ name: cat, postId: post.id });
    }
  }

  if (post?.slug) {
    return redirect(`/post/${post.slug}`);
  } else return post;
}