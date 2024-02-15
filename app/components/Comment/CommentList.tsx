import { Box, Button, Loader, Text, Title } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { CommentCard } from '~/components/Comment/CommentCard';
import { Comment } from '~/types/Comment';
import CommentEditor from './Editor';
import { IconSquarePlus } from '@tabler/icons-react';
import { subject, useAbility } from '~/hooks/useAbility';
import { useFetcher } from '@remix-run/react';
import { useInViewport } from '@mantine/hooks';

export function CommentList({
  postId,
  data: { nodes: commentNodes, avatarURL, totalCount, count }
}: {
  postId: number;
  data: { nodes: Comment[] };
}) {
  console.log(`total: ${totalCount}`);
  console.log(`count: ${count}`);
  const [openEditor, setOpenEditor] = useState(false);
  const [comments, setComments] = useState(commentNodes);
  const [page, setPage] = useState(1);
  const [limit] = useState(count);
  const [offset] = useState(count);
  const ability = useAbility();
  const fetcher = useFetcher();
  const { ref, inViewport } = useInViewport();
  const pages = Math.ceil(totalCount / limit);
  const commentsRef = useRef(commentNodes);

  useEffect(() => {
    if (
      totalCount !== comments?.length &&
      inViewport &&
      fetcher.state === 'idle' &&
      page !== pages
    ) {
      fetcher.load(
        `/comments/post/${postId}?limit=${limit}&offset=${page * offset}`
      );
      setPage((prev) => prev + 1);
    }
  }, [comments?.length, fetcher, inViewport, postId, totalCount]);

  useEffect(() => {
    if (fetcher?.data?.comments?.nodes) {
      setComments((prev) => [...prev, ...fetcher.data.comments.nodes]);
      console.log(fetcher.data);
    }
  }, [fetcher?.data?.comments?.nodes]);

  useEffect(() => {
    if (
      totalCount !== comments?.length &&
      commentsRef.current !== commentNodes
    ) {
      setComments(commentNodes);
      commentsRef.current = commentNodes;
    }
  }, [commentNodes, comments, totalCount]);

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
          {comments?.map((comment, index) => (
            <CommentCard
              key={`comment-${comment.id}`}
              data={comment}
              avatarURL={avatarURL}
            />
          ))}
          <Box ref={ref}>
            {fetcher.state === 'loading' && (
              <Loader color="violet" type="dots" />
            )}
          </Box>
        </>
      ) : (
        <Text>No Comments</Text>
      )}
    </>
  );
}
