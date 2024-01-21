import { getBreakpointValue, Paper, useMantineTheme } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { lazy } from 'react';

// Lazy Import Category Editor
const CategoryEditor = lazy(
  async () => await import('~/components/Category/Editor')
);
// Lazy Import Post Editor
const PostEditor = lazy(async () => await import('~/components/Post/Editor'));

export default function Editor({
  category,
  post
}: {
  category?: boolean;
  post?: boolean;
}) {
  const { width } = useViewportSize();
  const theme = useMantineTheme();
  const currentBreakpoint = getBreakpointValue(theme.breakpoints.md, theme);
  const breakpoint = Boolean(width >= currentBreakpoint);

  return (
    <Paper px={breakpoint ? 10 : 0} py={breakpoint ? 0 : 10}>
      {post && <PostEditor />}
      {category && <CategoryEditor />}
    </Paper>
  );
}
