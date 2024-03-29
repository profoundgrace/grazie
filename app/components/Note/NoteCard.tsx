/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import {
  ActionIcon,
  Anchor,
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
import classes from '~/components/Note/NoteCard.module.css';
import { NoteLabel } from '~/types/NoteLabel';

interface NoteCardProps {
  id: number;
  image?: string;
  labels?: NoteLabel[];
  createdAt: number;
  title: string;
  body: object;
  footer?: string;
  author: {
    name: string;
    description: string;
    image: string;
  };
  updatedAt?: string;
  slug?: string;
}

export default function NoteCard({
  data: {
    id,
    image = '',
    labels = [],
    createdAt,
    body = {},
    title = '',
    footer = '',
    author,
    updatedAt = ''
  }
}: {
  data: NoteCardProps;
}) {
  const theme = useMantineTheme();

  return (
    <Card withBorder mb={6} radius="md" className={classes.card}>
      <Card.Section className={classes.header}>
        <Group justify="space-between">
          <Group gap={0} p={4}>
            {labels?.length > 0 ? (
              labels.map(
                ({
                  label: { name: labelName, slug: labelSlug },
                  labelId: labelNoteId
                }) => (
                  <Link key={`label-${labelNoteId}`} to={`/posts/${labelSlug}`}>
                    <Badge mr={4} radius="md" size="md" variant="light">
                      {labelName}
                    </Badge>
                  </Link>
                )
              )
            ) : (
              <Anchor
                className={classes.title}
                component={Link}
                fw={700}
                gradient={{ from: 'indigo', to: 'blue', deg: 90 }}
                to={`/note/${id}`}
                variant="gradient"
              >
                {title}
              </Anchor>
            )}
          </Group>

          <Group gap={0} p={4}>
            <TimeSince timestamp={createdAt} pr={4} />
          </Group>
        </Group>
      </Card.Section>
      {title && labels?.length > 0 ? (
        <Card.Section className={classes.header}>
          <Anchor
            className={classes.title}
            component={Link}
            fw={700}
            gradient={{ from: 'indigo', to: 'blue', deg: 90 }}
            pl={4}
            to={`/note/${id}`}
            variant="gradient"
          >
            {title}
          </Anchor>
        </Card.Section>
      ) : null}
      <Card.Section
        className={classes.body}
        pt={labels?.length > 0 ? 10 : undefined}
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
