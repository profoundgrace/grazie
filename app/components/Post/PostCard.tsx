import {
  ActionIcon,
  Avatar,
  Badge,
  Card,
  Group,
  Text,
  useMantineTheme
} from '@mantine/core';
import { Link } from '@remix-run/react';
import { IconHeart, IconBookmark, IconShare } from '@tabler/icons-react';
import { TimeSince } from '~/components/DateTime';
import HTMLContent from '~/components/Tiptap/HTMLContent';
import classes from '~/components/Post/PostCard.module.css';
import { CategoryPost } from '~/types/CategoryPost';

interface ArticleCardProps {
  image?: string;
  categories?: CategoryPost[];
  createdAt?: number;
  title: string;
  body: object;
  footer?: string;
  author: {
    name: string;
    description: string;
    image: string;
  };
  updatedAt?: string;
}

export default function PostCard({
  data: {
    image = '',
    categories = [],
    createdAt,
    body = {},
    title = '',
    slug,
    footer = '',
    author,
    updatedAt = ''
  }
}: {
  data: ArticleCardProps;
}) {
  const theme = useMantineTheme();

  return (
    <Card withBorder mb={6} radius="md" className={classes.card}>
      <Card.Section className={classes.header}>
        <Group justify="space-between">
          <Group gap={0} p={4}>
            {categories?.length > 0 ? (
              categories.map(
                ({
                  category: { name: categoryName, slug: catSlug },
                  id: catPostId
                }) => (
                  <Link key={`${catPostId}`} to={`/posts/${catSlug}`}>
                    <Badge mr={4} radius="md" size="md" variant="light">
                      {categoryName}
                    </Badge>
                  </Link>
                )
              )
            ) : (
              <Text
                fw={700}
                className={classes.title}
                component={Link}
                to={`/post/${slug}`}
              >
                {title}
              </Text>
            )}
          </Group>

          <Group gap={0} p={4}>
            <TimeSince timestamp={createdAt} pr={4} />
          </Group>
        </Group>
      </Card.Section>
      {title && categories?.length > 0 ? (
        <Card.Section className={classes.header}>
          <Text
            fw={700}
            className={classes.title}
            component={Link}
            to={`/post/${slug}`}
          >
            {title}
          </Text>
        </Card.Section>
      ) : null}
      <Card.Section className={classes.body}>
        <HTMLContent content={body} />
      </Card.Section>
      {footer ? (
        <Group mt="xs">
          <Text size="xs" c="dimmed">
            {footer}
          </Text>
        </Group>
      ) : null}

      <Card.Section className={classes.footer}>
        <Group justify="space-between">
          <Group>
            <Avatar src={author.image} radius="sm" />
            <div>
              <Text size="sm" fw={500} pl={3}>
                {author.name}
              </Text>
              <Text size="xs" c="dimmed" pl={3}>
                {author.description}
              </Text>
            </div>
          </Group>
          <Group gap={0}>
            <ActionIcon variant="subtle" color="gray">
              <IconHeart size={22} color={theme.colors.red[6]} stroke={1.5} />
            </ActionIcon>
            <ActionIcon variant="subtle" color="gray">
              <IconBookmark
                size={22}
                color={theme.colors.yellow[6]}
                stroke={1.5}
              />
            </ActionIcon>
            <ActionIcon variant="subtle" color="gray">
              <IconShare size={22} color={theme.colors.blue[6]} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Group>
      </Card.Section>
    </Card>
  );
}
