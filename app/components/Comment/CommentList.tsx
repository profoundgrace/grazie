import { Box, Button, Text, Title } from '@mantine/core';
import { useState } from 'react';
import { CommentCard } from '~/components/Comment/CommentCard';
import { Comment } from '~/types/Comment';
import CommentEditor from './Editor';
import { IconSquarePlus } from '@tabler/icons-react';

export function CommentList({
  postId,
  data: { nodes: comments, avatarURL }
}: {
  postId: number;
  data: { nodes: Comment[] };
}) {
  const [openEditor, setOpenEditor] = useState(false);
  return (
    <>
      <Title>Comments</Title>
      {!openEditor && (
        <Box my={10}>
          <Button
            leftSection={<IconSquarePlus size={14} />}
            onClick={() => setOpenEditor(true)}
            variant="light"
          >
            New Post
          </Button>
        </Box>
      )}
      {openEditor && (
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
