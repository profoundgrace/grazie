import { getBreakpointValue, Paper, useMantineTheme } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { lazy } from 'react';

// Lazy Import Category Editor
const CategoryEditor = lazy(
  async () => await import('~/components/Category/Editor')
);
// Lazy Import Page Editor
const PageEditor = lazy(async () => await import('~/components/Page/Editor'));

// Lazy Import Post Editor
const PostEditor = lazy(async () => await import('~/components/Post/Editor'));

export default function Editor({
  category,
  page,
  post
}: {
  category?: boolean;
  page?: boolean;
  post?: boolean;
}) {
  const { width } = useViewportSize();
  const theme = useMantineTheme();
  const currentBreakpoint = getBreakpointValue(theme.breakpoints.md, theme);
  const breakpoint = Boolean(width >= currentBreakpoint);
  const data = useLoaderData();
  let pageData, postData, categoryData;

  if (page) {
    pageData = data.page;
  }
  if (post) {
    postData = data.post;
  }

  if (category) {
    categoryData = data.category;
  }

  return (
    <Paper px={breakpoint ? 10 : 0} py={breakpoint ? 0 : 10}>
      {page && <PageEditor {...pageData} />}
      {post && <PostEditor {...postData} />}
      {category && <CategoryEditor {...categoryData} />}
    </Paper>
  );
}
