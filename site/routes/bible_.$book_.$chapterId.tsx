import {
  ActionIcon,
  Anchor,
  Box,
  Breadcrumbs,
  Button,
  Center,
  Grid,
  Group,
  Highlight,
  rem,
  SegmentedControl,
  Space,
  Text,
  Title,
  Tooltip
} from '@mantine/core';
import { useLocalStorage, useViewportSize } from '@mantine/hooks';
import {
  Link,
  type LoaderFunctionArgs,
  useLoaderData,
  useSearchParams
} from 'react-router';
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconChevronUp,
  IconHighlight,
  IconHighlightOff,
  IconMinus,
  IconPlus,
  IconTextSize,
  IconViewportNarrow,
  IconViewportWide
} from '@tabler/icons-react';
import { useState } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { getChapter } from '~/lib/kjv.server';
import { SEO } from '~/utils/meta';
import { createAbility } from '~/utils/session.server';

export function meta({ data, matches }: { matches: typeof loader }) {
  return SEO({
    title: `${data?.chapter?.book?.book} ${data?.chapter?.book?.chapter} - Holy Bible`,
    matches
  });
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  const bookSlug = params?.book;
  const chapterId = Number(params?.chapterId);

  const chapter = await getChapter({
    filter: { book: bookSlug, chapter: chapterId },
    include: {
      book: true,
      prevBook: true,
      nextBook: true,
      prevChapter: true,
      nextChapter: true
    }
  });

  chapter.book.chapter = chapterId;

  return { chapter };
}

export default function BibleBookChapter() {
  const data = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const [showHighlight, setShowHighlight] = useState(
    search !== '' ? true : false
  );

  const { width } = useViewportSize();

  const {
    book,
    prevBook,
    nextBook,
    prevChapter,
    nextChapter,
    nodes: verses
  } = data.chapter;

  const [layoutValue, setLocalStorageLayout] = useLocalStorage({
    key: 'layout',
    defaultValue: 'wide'
  });

  const layout =
    layoutValue === 'wide' || width < 550
      ? { width: '100%', margin: undefined }
      : { width: '50%', margin: '0 auto' };

  const [fontSizeValue, setLocalStorageFontSize] = useLocalStorage({
    key: 'fontSize',
    defaultValue: 1
  });

  const fontSize = rem(`${fontSizeValue}rem`);

  const handleFontSize = ({
    dec = false,
    inc = false
  }: {
    dec?: boolean;
    inc?: boolean;
  }) => {
    if (dec && fontSizeValue <= 1) return;
    if (inc && fontSizeValue >= 2) return;
    if (inc) {
      setLocalStorageFontSize(fontSizeValue + 0.1);
    } else if (dec) {
      setLocalStorageFontSize(fontSizeValue - 0.1);
    }
  };

  const paragraphs = verses?.map((verse) => {
    const coding = verse.coding?.match('&para;');
    if (coding) return verse.ver;
  });

  const crumbs = [
    { title: 'Home', href: '/' },
    { title: 'Holy Bible', href: '/bible' },
    {
      title: book.bid < 40 ? 'Old Testament' : 'New Testament',
      href: `/bible/${book.id <= 39 ? 'ot' : 'nt'}`
    },
    { title: book.book, href: `/bible/${book.slug}` },
    {
      title: `Chapter ${book.chapter}`,
      href: `/bible/${book.slug}/${book.chapter}`
    }
  ].map((item, index) => (
    <Anchor component={Link} to={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  const NavBar = () => (
    <>
      <Group justify="center" mt={10} gap={0}>
        {prevBook && width > 768 && (
          <Tooltip label="Previous Book">
            <Button
              component={Link}
              to={`/bible/${prevBook.slug}`}
              variant="subtle"
              radius="lg"
              size="compact-md"
              leftSection={<IconChevronsLeft />}
            >
              {prevBook.book}
            </Button>
          </Tooltip>
        )}
        {prevChapter && (
          <Tooltip label="Previous Chapter">
            <Button
              component={Link}
              to={`/bible/${book.slug}/${prevChapter}`}
              variant="subtle"
              radius="lg"
              size="compact-lg"
              leftSection={<IconChevronLeft />}
            >
              {prevChapter}
            </Button>
          </Tooltip>
        )}
        <Tooltip label="Chapters">
          <Button
            component={Link}
            to={`/bible/${book.slug}`}
            variant="subtle"
            radius="xl"
            size="compact-lg"
          >
            <IconChevronUp size={30} />
          </Button>
        </Tooltip>
        {nextChapter && (
          <Tooltip label="Next Chapter">
            <Button
              component={Link}
              to={`/bible/${book.slug}/${nextChapter}`}
              variant="subtle"
              radius="lg"
              size="compact-lg"
              rightSection={<IconChevronRight />}
            >
              {nextChapter}
            </Button>
          </Tooltip>
        )}
        {nextBook && width > 768 && (
          <Tooltip label="Next Book">
            <Button
              component={Link}
              to={`/bible/${nextBook.slug}`}
              variant="subtle"
              radius="lg"
              size="compact-md"
              rightSection={<IconChevronsRight />}
            >
              {nextBook.book}
            </Button>
          </Tooltip>
        )}
      </Group>
      {width <= 768 && (
        <Group justify="center" mt={10} gap={0}>
          {prevBook && (
            <Tooltip label="Previous Book">
              <Button
                component={Link}
                to={`/bible/${prevBook.slug}`}
                variant="subtle"
                radius="lg"
                size="compact-md"
                leftSection={<IconChevronsLeft />}
              >
                {prevBook.book}
              </Button>
            </Tooltip>
          )}
          {nextBook && (
            <Tooltip label="Next Book">
              <Button
                component={Link}
                to={`/bible/${nextBook.slug}`}
                variant="subtle"
                radius="lg"
                size="compact-md"
                rightSection={<IconChevronsRight />}
              >
                {nextBook.book}
              </Button>
            </Tooltip>
          )}
        </Group>
      )}
    </>
  );

  return (
    <Grid>
      <Grid.Col span={12}>
        <Title order={2}>Holy Bible</Title>
        <Breadcrumbs my={12}>{crumbs}</Breadcrumbs>
        <Group justify="space-between">
          <Title order={1} my={8}>
            {book?.book} {book?.chapter}
          </Title>
          <Group justify="flex-end">
            {search !== '' && (
              <Tooltip label="Toggle Search Highlight">
                <ActionIcon
                  onClick={() => setShowHighlight(!showHighlight)}
                  size="lg"
                  variant="default"
                >
                  {showHighlight ? <IconHighlightOff /> : <IconHighlight />}
                </ActionIcon>
              </Tooltip>
            )}
            {width >= 550 && (
              <SegmentedControl
                value={layoutValue}
                data={[
                  {
                    label: (
                      <Center style={{ gap: 10 }}>
                        <IconViewportWide
                          style={{ width: rem(16), height: rem(16) }}
                        />
                        <span>Wide</span>
                      </Center>
                    ),
                    value: 'wide'
                  },
                  {
                    label: (
                      <Center style={{ gap: 10 }}>
                        <IconViewportNarrow
                          style={{ width: rem(16), height: rem(16) }}
                        />
                        <span>Narrow</span>
                      </Center>
                    ),
                    value: 'narrow'
                  }
                ]}
                onChange={setLocalStorageLayout}
              />
            )}
            <Button.Group>
              <Button
                disabled={fontSizeValue >= 2}
                leftSection={<IconTextSize size={16} />}
                variant="default"
                onClick={() => handleFontSize({ inc: true })}
              >
                <IconPlus />
              </Button>
              <Button
                disabled={fontSizeValue <= 1}
                leftSection={<IconTextSize size={20} />}
                variant="default"
                onClick={() => handleFontSize({ dec: true })}
              >
                <IconMinus />
              </Button>
            </Button.Group>
          </Group>
        </Group>

        <NavBar />
        <Box w={layout.width} m={layout.margin}>
          {verses.map((verse) => (
            <Fragment key={`${verse.id}-${verse.ver}`}>
              {paragraphs?.includes(verse.ver) && <Space h="sm" />}
              <Text
                span
                size="xs"
                pb={6 * fontSizeValue}
                pos="relative"
                top="-0.5em"
                ml={8}
                mr={6}
              >
                {verse.ver}
              </Text>
              {showHighlight ? (
                <Highlight
                  color="rgb(241, 229, 158)"
                  highlight={search}
                  key={verse.id}
                  size={fontSize}
                  span
                >
                  {verse.txt}
                </Highlight>
              ) : (
                <Text size={fontSize} span>
                  {verse.txt}
                </Text>
              )}
            </Fragment>
          ))}
        </Box>
        <NavBar />
      </Grid.Col>
    </Grid>
  );
}
