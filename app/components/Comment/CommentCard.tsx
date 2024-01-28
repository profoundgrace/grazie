import { Text, Avatar, Group, Paper } from '@mantine/core';
import classes from '~/components/Comment/CommentCard.module.css';
import { TimeSince } from '~/components/DateTime';
import HTMLContent from '~/components/Tiptap/HTMLContent';

export function CommentHtml({
  comment: {
    author: { displayName },
    body,
    createdAt
  }
}) {
  return (
    <Paper withBorder radius="md" className={classes.comment}>
      <Group>
        <Avatar
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png"
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
      <HTMLContent
        content={body}
        classes={{ classes: { body: classes.body, content: classes.content } }}
      />
    </Paper>
  );
}
