import { getUserByUsername } from '~/lib/user.server';
import { getLogger } from '~/utils/logger.server';
import { formatSlug } from '~/utils/formatSlug';
import { dateString, timeStamp, timeString } from '~/utils/generic.server';
import { prisma } from '~/utils/prisma.server';
import type { PostInput } from '~/types/Post';
import { getCategory } from './category.server';

const log = getLogger('Posts Query');

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
  const slugs = await prisma.post.count({
    where
  });

  if (slugs > 0) {
    const slugs = await prisma.post.count({
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

export async function createPost({
  title,
  body,
  published,
  publishedAt,
  slugFormat = 'date-title',
  slug,
  authorId
}: PostInput) {
  try {
    const date = timeStamp();
    if (published && !publishedAt) {
      publishedAt = date;
    }
    const data = {
      body: body?.type ? (JSON.stringify(body) as string) : (body as string),
      title,
      createdAt: date,
      published,
      publishedAt,
      updatedAt: date,
      authorId,
      slug: `${timeString()}_${title}`
    };

    const post = await prisma.post.create({
      data
    });

    slug = formatSlug({
      format: slugFormat,
      id: post.id,
      title,
      date: post?.publishedAt
        ? dateString({ timestamp: post.publishedAt })
        : dateString({ timestamp: post?.createdAt }),
      slug
    });

    slug = await slugCheck(slug);

    const update = await prisma.post.update({
      where: { id: post.id },
      data: {
        slug
      },
      select: {
        slug: true
      }
    });

    post.slug = update.slug;

    return post;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function updatePost({
  id,
  published,
  body,
  title,
  slugFormat,
  slug
}: PostInput) {
  try {
    const date = timeStamp();
    const data = {
      body,
      title,
      published,
      updatedAt: date,
      slug: undefined
    };

    const prevStatus = await prisma.post.findUnique({
      where: {
        id
      },
      select: {
        published: true,
        slug: true
      }
    });
    if (prevStatus?.published !== published) {
      data.published = published;
      if (!published) {
        data.publishedAt = null;
      } else {
        data.publishedAt = date;
      }
    }

    if (prevStatus?.slug !== slug) {
      data.slug = formatSlug({
        format: slugFormat,
        id: post.id,
        title
      });
    }

    const post = await prisma.post.update({
      where: {
        id
      },
      data
    });

    return post;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function getPost({ id, slug, select }) {
  try {
    const where = {} as { id?: number; slug?: string };

    if (id) {
      where.id = id;
    } else if (slug) {
      where.slug = slug;
    } else {
      throw new Error(`Either Post slug or id is required`);
    }
    const post = await prisma.post.findUnique({
      where,
      select: select ?? {
        id: true,
        title: true,
        body: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
        published: true,
        publishedAt: true,
        slug: true,
        author: {
          select: {
            displayName: true
          }
        },
        categories: {
          select: {
            catId: true,
            category: {
              select: {
                name: true,
                slug: true
              }
            }
          }
        }
      }
    });
    return post;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function getPosts({
  filter = {}
}: {
  filter?: { username?: string; category?: string };
}) {
  try {
    const where = {} as { authorId?: number; category?: any };

    if (filter?.username) {
      where.authorId = await getUserByUsername(filter.username);
    }

    if (filter?.category) {
      const category = await getCategory({
        slug: filter.category,
        select: { id: true }
      });
      if (category) {
        where.categories = {
          some: {
            catId: category.id
          }
        };
      } else {
        throw new Error(`Category ${filter.category} was not found`);
      }
    }

    const articles = await prisma.post.findMany({
      where,
      select: {
        id: true,
        published: true,
        authorId: true,
        createdAt: true,
        publishedAt: true,
        updatedAt: true,
        title: true,
        body: true,
        slug: true,
        search: true,
        meta: true,
        author: {
          select: {
            displayName: true,
            username: true
          }
        },
        categories: {
          select: {
            catId: true,
            category: {
              select: {
                name: true,
                slug: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return {
      count: articles.length,
      totalCount: await prisma.post.count({ where }),
      nodes: articles
    };
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}
