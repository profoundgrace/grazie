import { Text, Avatar, Group, Paper, Box } from '@mantine/core';
import classes from '~/components/Comment/CommentCard.module.css';
import { TimeSince } from '~/components/DateTime';
import HTMLContent from '~/components/Tiptap/HTMLContent';

export function CommentCard({
  data: {
    author: { displayName, avatar },
    body,
    createdAt
  },
  avatarURL
}) {
  return (
    <Paper withBorder radius="md" className={classes.comment} mb="sm">
      <Group>
        <Avatar
          src={`${avatarURL}md/${avatar}`}
          alt="Jacob Warnhalter"
          radius="xl"
        />
        <div>
          <Text fz="sm">{displayName}</Text>
          <Text fz="xs" c="dimmed">
            <TimeSince timestamp={createdAt} pr={4} />
          </Text>
        </div>
      </Group>
      <Box pl={54} pt="sm">
        <HTMLContent
          content={JSON.parse(body)}
          classes={{
            classes: { body: classes.body, content: classes.content }
          }}
        />
      </Box>
    </Paper>
  );
}
