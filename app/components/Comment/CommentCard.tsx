import { Text, Avatar, Group, Paper, Box, Button } from '@mantine/core';
import { useState } from 'react';
import classes from '~/components/Comment/CommentCard.module.css';
import { TimeSince } from '~/components/DateTime';
import HTMLContent from '~/components/Tiptap/HTMLContent';
import CommentEditor from './Editor';
import { IconArrowBack } from '@tabler/icons-react';

export function CommentCard({
  data: {
    id,
    postId,
    parentId,
    author: { displayName, avatar },
    body,
    createdAt,
    path
  },
  avatarURL
}) {
  const [replyEditor, setReplyEditor] = useState(false);
  const depth = parentId ? path.split('/').length - 1 : 0;

  return (
    <Paper
      withBorder
      radius="md"
      className={classes.comment}
      mb="sm"
      ml={depth * 20}
      style={{
        borderLeft: depth
          ? '2px solid var(--mantine-primary-color-filled)'
          : undefined
      }}
    >
      <Group>
        <Avatar
          src={`${avatarURL}md/${avatar}`}
          alt="Jacob Warnhalter"
          radius="xl"
        />
        <div>
          <Text fz="sm">{displayName}</Text>
          <TimeSince timestamp={createdAt} fz="xs" c="dimmed" pr={4} />
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
      {!replyEditor && (
        <Button
          leftSection={<IconArrowBack size="20" />}
          onClick={() => setReplyEditor(true)}
          radius="xl"
          size="compact-sm"
          variant="light"
        >
          Reply
        </Button>
      )}
      {replyEditor && (
        <CommentEditor
          postId={postId}
          parentId={id}
          closeEditor={setReplyEditor}
        />
      )}
    </Paper>
  );
}
