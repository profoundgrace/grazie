import { getBook } from '!~/lib/kjv.server';
import { Anchor, Breadcrumbs, Button, Grid, Group, Title } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { Link, type LoaderFunctionArgs, useLoaderData } from 'react-router';
import { SEO } from '~/utils/meta';
import { createAbility } from '~/utils/session.server';

export function meta({ data, matches }: { matches: typeof loader }) {
  return SEO({
    title: `${data?.book?.book} - Holy Bible`,
    matches
  });
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  const bookSlug = params?.book;

  const book = await getBook({
    filter: { book: bookSlug },
    include: { prevBook: true, nextBook: true }
  });

  return { book };
}

function Chapters({ book, count }: { book: object; count: number }) {
  const buttons = Array.from({ length: count }, (_, index) => index + 1);

  return (
    <>
      {buttons.map((number) => (
        <Button
          key={number}
          component={Link}
          to={`/bible/${book.slug}/${number}`}
          variant="outline"
          radius="sm"
          size="sm"
        >
          {number}
        </Button>
      ))}
    </>
  );
}

export default function BibleBook() {
  const data = useLoaderData<typeof loader>();

  const book = data?.book;
  const { prevBook, nextBook } = book;

  const crumbs = [
    { title: 'Home', href: '/' },
    { title: 'Holy Bible', href: '/bible' },
    {
      title: book.bid < 40 ? 'Old Testament' : 'New Testament',
      href: `/bible/${book.id <= 39 ? 'ot' : 'nt'}`
    },
    { title: book.book, href: `/bible/${book.slug}` }
  ].map((item, index) => (
    <Anchor component={Link} to={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  return (
    <Grid>
      <Grid.Col span={12}>
        <Title order={2}>Holy Bible</Title>
        <Breadcrumbs my={12}>{crumbs}</Breadcrumbs>
        <Title order={1} my={8}>
          {book?.book}
        </Title>
        <Group my={10}>
          {prevBook && (
            <Button
              component={Link}
              to={`/bible/${prevBook.slug}`}
              variant="subtle"
              radius="lg"
              size="compact-md"
              leftSection={<IconChevronLeft size={16} />}
            >
              {prevBook.book}
            </Button>
          )}
          <Chapters book={book} count={book?.chs ?? 0} />
          {nextBook && (
            <Button
              component={Link}
              to={`/bible/${nextBook.slug}`}
              variant="subtle"
              radius="lg"
              size="compact-md"
              rightSection={<IconChevronRight size={16} />}
            >
              {nextBook.book}
            </Button>
          )}
        </Group>
      </Grid.Col>
    </Grid>
  );
}
