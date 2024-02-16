import { getUserByUsername } from '~/lib/user.server';
import { avatarURL } from '~/utils/config.server';
import { getLogger } from '~/utils/logger.server';
import { formatSlug } from '~/utils/formatSlug';
import { dateString, timeStamp, timeString } from '~/utils/generic.server';
import { prisma } from '~/utils/prisma.server';
import type { CommentInput } from '~/types/Comment';
import { getCategory } from './category.server';

const log = getLogger('Comments Query');

async function slugCheck(slug: string, id = undefined) {
  let where = { slug };
  if (id) {
    where = {
      AND: [
        { slug },
        {
          id: {
            not: id
          }
        }
      ]
    };
  }
  const slugs = await prisma.comment.count({
    where
  });

  if (slugs > 0) {
    const slugs = await prisma.comment.count({
      where: {
        slug: {
          startsWith: slug
        }
      }
    });
    slug = `${slug}-${slugs + 1}`;
  }

  return slug;
}

export async function createComment({
  locked,
  pinned,
  parentId = null,
  authorId,
  postId,
  body
}: CommentInput) {
  try {
    const date = timeStamp();
    let parent, threadPath;
    if (parentId) {
      parent = await prisma.comment.findUnique({
        where: { id: parentId },
        select: {
          id: true,
          locked: true,
          path: true
        }
      });
      if (parent?.id) {
        threadPath = `${parent.path}/${date}`;
      } else {
        throw new Error('Parent comment was not found');
      }
    }

    const data = {
      locked,
      pinned,
      body: body?.type ? (JSON.stringify(body) as string) : (body as string),
      createdAt: date,
      updatedAt: date,
      parentId,
      postId,
      authorId,
      path: threadPath ?? `${date}`
    };

    const comment = await prisma.comment.create({
      data
    });
    // threadPath is an inheritable and sortable string hierarchy of 'timeStamp' + 'id'
    // the initial threadPath includes the parent threadPath (if applicable), a new timeStamp, and is then appended by the 'id' portion here
    // the 'id' is a string formatted as ("'_key.length'+'_key'") to prevent threadPath unique conflicts, while retaining sortability
    // this 'id' results in a numeric sortable string, such as 001+1 or 002+10 or 010+1000000000
    // a length limit of 999 digits
    const idLength = [...`${comment.id}`].length;
    const zero = '0';
    const prependZeros = `${zero.repeat(3 - 1 - Math.floor(idLength / 10))}`;
    threadPath = `${comment.path}(${prependZeros}${idLength}+${comment.id})`;

    await prisma.post.update({
      where: {
        id: postId
      },
      data: {
        commentsCount: await prisma.comment.count({ where: { postId } })
      }
    });

    if (parentId) {
      await prisma.comment.update({
        where: {
          id: parentId
        },
        data: {
          repliesCount: await prisma.comment.count({ where: { parentId } }),
          lastActivityAt: date
        }
      });
    }

    return await prisma.comment.update({
      where: { id: comment.id },
      data: {
        path: threadPath
      }
    });
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function updateComment({
  id,
  locked,
  pinned,
  body
}: CommentInput) {
  try {
    if (!id) {
      throw new Error(`Comment Update requires a comment id (${id})`);
    }
    const date = timeStamp();
    const data = {
      locked,
      pinned,
      updatedAt: date
    } as CommentInput;

    if (body) {
      data.body = body?.type
        ? (JSON.stringify(body) as string)
        : (body as string);
    }

    const comment = await prisma.comment.update({
      where: {
        id
      },
      data
    });

    return comment;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function getComment({ id, select }) {
  try {
    const where = {} as { id?: number; slug?: string };

    if (id) {
      where.id = id;
    } else {
      throw new Error(`Comment id (${id}) is required`);
    }
    const comment = await prisma.comment.findUnique({
      where,
      select: select ?? {
        id: true,
        locked: true,
        pinned: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
        lastActivityAt: true,
        parentId: true,
        postId: true,
        repliesCount: true,
        path: true,
        body: true,
        search: true,
        meta: true,
        author: {
          select: {
            username: true,
            displayName: true,
            avatar: true
          }
        }
      }
    });
    return comment;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function getComments({
  filter = {},
  sort = { field: 'createdAt', order: 'desc' },
  limit = 25,
  offset = 0
}: {
  filter?: { username?: string; postId?: number };
  sort?: { field?: string; order?: string };
  limit?: number;
  offset?: number;
}) {
  try {
    const where = {} as { authorId?: number; postId?: number };

    if (filter?.username) {
      where.authorId = await getUserByUsername(filter.username);
    }
    if (filter?.postId) {
      where.postId = filter.postId;
    }
    const orderBy = { [sort.field]: sort.order };

    const comments = await prisma.comment.findMany({
      where,
      select: {
        id: true,
        locked: true,
        pinned: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
        lastActivityAt: true,
        parentId: true,
        postId: true,
        repliesCount: true,
        path: true,
        body: true,
        search: true,
        meta: true,
        author: {
          select: {
            username: true,
            displayName: true,
            avatar: true
          }
        }
      },
      orderBy,
      take: limit,
      skip: offset
    });

    return {
      avatarURL,
      count: comments.length,
      totalCount: await prisma.comment.count({ where }),
      nodes: comments
    };
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}
