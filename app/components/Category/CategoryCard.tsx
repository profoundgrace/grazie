import { Card, Group, Text, useMantineTheme } from '@mantine/core';
import classes from '~/components/Category/CategoryCard.module.css';
import { Category } from '~/types/Category';

interface CategoryCardProps {
  categories?: Category[];
  description?: string;
  name?: string;
  path?: string;
  slug?: string;
  postsCount?: number;
}

export default function PostCard({
  data: { categories, description, name, path, slug, postsCount }
}: {
  data: CategoryCardProps;
}) {
  const theme = useMantineTheme();

  return (
    <Card withBorder mb={6} radius="md" className={classes.card}>
      <Text fw={700} className={classes.title}>
        {name}
      </Text>

      {description}

      <Group mt="xs">
        <Text size="xs" c="dimmed">
          {postsCount && postsCount > 0
            ? `Posts: ${postsCount}`
            : 'No Posts Assigned'}
        </Text>
      </Group>
    </Card>
  );
}
