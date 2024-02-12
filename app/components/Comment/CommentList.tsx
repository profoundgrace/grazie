import { Box, Button, Text, Title } from '@mantine/core';
import { useState } from 'react';
import { CommentCard } from '~/components/Comment/CommentCard';
import { Comment } from '~/types/Comment';
import CommentEditor from './Editor';
import { IconSquarePlus } from '@tabler/icons-react';
import { subject, useAbility } from '~/hooks/useAbility';

export function CommentList({
  postId,
  data: { nodes: comments, avatarURL }
}: {
  postId: number;
  data: { nodes: Comment[] };
}) {
  const [openEditor, setOpenEditor] = useState(false);
  const ability = useAbility();
  return (
    <>
      <Title order={2}>Comments</Title>
      {ability.can('create', subject('Comment', {})) && !openEditor && (
        <Box my={10}>
          <Button
            leftSection={<IconSquarePlus size={14} />}
            onClick={() => setOpenEditor(true)}
            variant="light"
          >
            New Comment
          </Button>
        </Box>
      )}
      {ability.can('create', subject('Comment', {})) && openEditor && (
        <Box my={10}>
          <CommentEditor postId={postId} closeEditor={setOpenEditor} />
        </Box>
      )}
      {comments?.length > 0 ? (
        <>
          {comments?.map((comment) => (
            <CommentCard
              key={`comment-${comment.id}`}
              data={comment}
              avatarURL={avatarURL}
            />
          ))}
        </>
      ) : (
        <Text>No Comments</Text>
      )}
    </>
  );
}
