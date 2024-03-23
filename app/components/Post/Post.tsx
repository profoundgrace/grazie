import {
  ActionIcon,
  Anchor,
  Avatar,
  Badge,
  Card,
  Grid,
  Group,
  Menu,
  Text,
  rem,
  useMantineTheme
} from '@mantine/core';
import { Link } from '@remix-run/react';
import {
  IconHeart,
  IconBookmark,
  IconShare,
  IconMessage,
  IconEye,
  IconDotsVertical,
  IconEdit,
  IconExclamationMark
} from '@tabler/icons-react';
import { TimeSince } from '~/components/DateTime';
import HTMLContent from '~/components/Tiptap/HTMLContent';
import classes from '~/components/Post/PostCard.module.css';
import { CategoryPost } from '~/types/CategoryPost';
import { useState } from 'react';
import PostEditor from './Editor';
import { unifiedStyles } from '~/utils/unify';

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
  published?: boolean;
  updatedAt?: string;
}

const actionIconStyle = unifiedStyles.icons.action.style;
const actionIconStroke = unifiedStyles.icons.action.stroke;

export default function Post({ data }: { data: ArticleCardProps }) {
  const {
    image = '',
    categories = [],
    createdAt,
    commentsCount = 0,
    viewsCount,
    body = {},
    title = '',
    slug,
    footer = '',
    author,
    updatedAt = '',
    published
  } = data;
  const theme = useMantineTheme();
  const [openEditor, setOpenEditor] = useState(null);
  return (
    <>
      <Card withBorder mb={6} radius="md" className={classes.card}>
        <Card.Section className={classes.header}>
          <Group justify="space-between">
            <Group gap={0} p={4}>
              {categories?.length > 0 ? (
                categories.map(
                  ({
                    category: { name: categoryName, slug: catSlug },
                    catId: catPostId
                  }) => (
                    <Link key={`catgory-${catPostId}`} to={`/posts/${catSlug}`}>
                      <Badge mr={4} radius="md" size="md" variant="light">
                        {categoryName}
                      </Badge>
                    </Link>
                  )
                )
              ) : (
                <Text
                  className={classes.title}
                  fw={700}
                  gradient={{ from: 'indigo', to: 'blue', deg: 90 }}
                  variant="gradient"
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
              className={classes.title}
              fw={700}
              gradient={{ from: 'indigo', to: 'blue', deg: 90 }}
              pl={4}
              variant="gradient"
            >
              {title}
            </Text>
          </Card.Section>
        ) : null}
        <Card.Section
          className={classes.body}
          pt={categories?.length > 0 ? 10 : undefined}
        >
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
          <Group gap={0} justify="space-between">
            <Group gap={0}>
              <Avatar src={author.image} radius="sm" />
              <div>
                <Text size="sm" fw={500} pl="xs">
                  {author.name}
                </Text>
                <Text size="xs" c="dimmed" pl="sm">
                  {author.description}
                </Text>
              </div>
              <Group gap={10} ml={10}>
                <Badge
                  variant="default"
                  leftSection={
                    <IconMessage
                      stroke={1}
                      style={{ width: rem(20), height: rem(20) }}
                    />
                  }
                >
                  {commentsCount}
                </Badge>
                <Badge
                  variant="default"
                  leftSection={
                    <IconEye
                      stroke={1}
                      style={{ width: rem(22), height: rem(22) }}
                    />
                  }
                >
                  {viewsCount}
                </Badge>
                {!published && (
                  <Badge color="yellow" variant="light">
                    Draft
                  </Badge>
                )}
              </Group>
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
                <IconShare
                  size={22}
                  color={theme.colors.blue[6]}
                  stroke={1.5}
                />
              </ActionIcon>
              <Menu trigger="click-hover" width="100px">
                <Menu.Target>
                  <ActionIcon
                    variant="subtle"
                    radius="md"
                    aria-label="Role Editor"
                  >
                    <IconDotsVertical
                      style={actionIconStyle}
                      stroke={actionIconStroke}
                    />
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>Post</Menu.Label>
                  <Menu.Item
                    leftSection={
                      <IconEdit style={{ width: rem(14), height: rem(14) }} />
                    }
                    onClick={() => setOpenEditor(true)}
                  >
                    Edit
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
        </Card.Section>
      </Card>
      {openEditor && (
        <Grid.Col span={12}>
          <PostEditor {...data} closeEditor={setOpenEditor} />
        </Grid.Col>
      )}
    </>
  );
}
