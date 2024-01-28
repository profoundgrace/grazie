import { Title, Grid, Tabs } from '@mantine/core';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { json, redirect } from '@remix-run/node'; // or cloudflare/deno
import { useLoaderData, useNavigate } from '@remix-run/react';
import { getUnixTime } from 'date-fns';
import Editor from '~/components/Editor';
import { createPage } from '~/lib/page.server';
import { getSession } from '~/utils/session.server';
import { site } from '@/grazie';

export function meta() {
  return [{ title: `Create Page${site?.separator}${site?.name}` }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const data = {};

  return json(data);
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const session = await getSession(request.headers.get('Cookie'));
  const authorId = session.get('userId') as number;
  const published = form.get('published') === 'on' ? true : false;
  const publishedAt = form.get('publishedAt') as string;
  const slugFormat = form.get('slugFormat') as string;
  const slug = form.get('slug') as string;

  const page = await createPage({
    published,
    publishedAt: getUnixTime(new Date(publishedAt)),
    body: form.get('body') as string,
    title: form.get('title') as string,
    summary: form.get('summary') as string,
    authorId,
    slugFormat,
    slug
  });

  if (page?.slug) {
    return redirect(`/page/${page.slug}`);
  } else return page;
}

export default function ArticlesCreate() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Grid>
      <Grid.Col span={12}>
        <Title order={2}>Pages</Title>
        <Tabs defaultValue="create" keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab value="create">Create</Tabs.Tab>
            <Tabs.Tab value="browse" onClick={() => navigate('/pages')}>
              Browse
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="create" py={10}>
            <Editor page />
          </Tabs.Panel>
        </Tabs>
      </Grid.Col>
    </Grid>
  );
}