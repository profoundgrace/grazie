import { getLogger } from '~/utils/logger.server';
import { prisma } from '~/utils/prisma.server';

const log = getLogger('KJV Bible');

export async function getBooks({
  filter = {}
}: {
  filter?: {
    testament?: string;
  };
} = {}) {
  try {
    const where = {} as {
      id?: object | number;
    };

    if (filter?.testament) {
      switch (filter?.testament) {
        case 'old':
        case 'ot':
          where.id = {
            lte: 39
          };
          break;
        case 'new':
        case 'nt':
          where.id = {
            gte: 40
          };
          break;
        case 'all':
        default:
          break;
      }
    }

    const books = await prisma.KJVBook.findMany({ where });
    return {
      nodes: books,
      count: books.length,
      totalCount: await prisma.KJVBook.count({ where })
    };
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function getBook({
  filter = {},
  select = { id: true, chs: true, book: true, abbr: true, slug: true },
  include = {}
}: {
  filter?: {
    id?: number;
    book?: string;
  };
  select?: object;
  include?: {
    prevBook?: boolean;
    nextBook?: boolean;
  };
}) {
  try {
    const where = {} as {
      id?: number;
      slug?: string;
    };

    if (filter?.id) {
      where.id = filter.id;
    }

    if (filter?.book) {
      where.slug = filter.book;
    }

    const data = await prisma.KJVBook.findUnique({
      where,
      select
    });

    if (include?.prevBook && data.id > 1) {
      data.prevBook = await prisma.KJVBook.findUnique({
        where: {
          id: data.id - 1
        }
      });
    }

    if (include?.nextBook && data.id < 66) {
      data.nextBook = await prisma.KJVBook.findUnique({
        where: {
          id: data.id + 1
        }
      });
    }

    return data;
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function getChapter({
  filter = {
    book: null,
    chapter: null
  },
  select = {
    id: true,
    bid: true,
    ch: true,
    ver: true,
    txt: true,
    coding: true
  },
  include = {
    book: false,
    prevBook: false,
    nextBook: false,
    prevChapter: false,
    nextChapter: false
  }
}: {
  filter?: {
    book?: string | null;
    bookId?: number | null;
    chapter?: number | null;
  };
  select?: object;
  include?: {
    book?: boolean;
    prevBook?: boolean;
    nextBook?: boolean;
    prevChapter?: boolean;
    nextChapter?: boolean;
  };
}) {
  try {
    const where = {} as {
      bid?: number;
      ch?: number;
    };

    let book, prevBook, nextBook, prevChapter, nextChapter;

    if (filter?.book) {
      book = await getBook({ filter: { book: filter.book } });
      where.bid = book.id;
    }

    if (filter?.bookId) {
      where.bid = filter.bookId;
    }

    if (filter?.chapter) {
      where.ch = filter.chapter;
    }
    // Must have bid to determine prev/next book
    if (include?.nextBook || include?.prevBook) {
      select.bid = true;
    }

    const data = await prisma.KJVVerse.findMany({
      where,
      select
    });

    if (include?.book && !book && data?.length > 0) {
      book = await prisma.KJVBook.findUnique({
        where: {
          id: data[0]?.bid
        },
        select: {
          id: true,
          chs: true,
          book: true,
          abbr: true,
          slug: true
        }
      });
    }

    prevChapter =
      include?.prevChapter &&
      filter?.chapter &&
      book &&
      filter?.chapter > 1 &&
      filter?.chapter <= book?.chs
        ? filter?.chapter - 1
        : null;

    nextChapter =
      include?.nextChapter &&
      filter?.chapter &&
      book &&
      filter?.chapter < book?.chs
        ? filter?.chapter + 1
        : null;

    if (include?.prevBook) {
      if (data[0]?.bid && data[0]?.bid > 1) {
        prevBook = await prisma.KJVBook.findUnique({
          where: {
            id: data[0]?.bid - 1
          }
        });
      } else {
        prevBook = null;
      }
    }

    if (include?.nextBook) {
      if (data[0]?.bid && data[0]?.bid < 66) {
        nextBook = await prisma.KJVBook.findUnique({
          where: {
            id: data[0]?.bid + 1
          }
        });
      } else {
        nextBook = null;
      }
    }

    return {
      nodes: data,
      count: data.length ?? 0,
      book,
      prevBook,
      nextBook,
      prevChapter,
      nextChapter
    };
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function getVerses({
  filter = {
    book: null,
    chapter: null,
    search: null
  },
  limit = 25,
  offset = 0,
  select = {
    id: true,
    bid: true,
    ch: true,
    ver: true,
    txt: true,
    coding: true
  },
  include = {
    book: false,
    prevVerse: false,
    nextVerse: false
  }
}: {
  filter?: {
    ot?: boolean;
    nt?: boolean;
    book?: string | null;
    bookId?: number | null;
    chapter?: number | null;
    search?: string | null;
  };
  limit?: number;
  offset?: number;
  select?: object;
  include?: {
    book?: boolean;
    prevVerse?: boolean;
    nextVerse?: boolean;
  };
}) {
  try {
    const where = {} as {
      bid?: number | { lte?: number; gte?: number };
      ch?: number;
      txt?: string | { contains: string };
    };

    let book, prevVerse, nextVerse;

    if (filter?.book) {
      book = await getBook({ filter: { book: filter.book } });
      where.bid = book.id;
    }
    if (filter?.ot) {
      where.bid = {
        lte: 39
      };
    }
    if (filter?.nt) {
      where.bid = {
        gte: 40
      };
    }
    if (filter?.bookId) {
      where.bid = filter.bookId;
    }
    if (filter?.chapter) {
      where.ch = filter.chapter;
    }
    if (filter?.search) {
      where.txt = {
        contains: filter.search
      };
    }

    const data = await prisma.KJVVerse.findMany({
      where,
      select,
      take: limit,
      skip: offset
    });

    if (include?.book && !book && data?.length > 0) {
      book = await prisma.KJVBook.findUnique({
        where: {
          id: data[0]?.bid
        },
        select: {
          id: true,
          chs: true,
          book: true,
          abbr: true,
          slug: true
        }
      });
    }

    return {
      nodes: data,
      count: data.length ?? 0,
      totalCount: await prisma.KJVVerse.count({ where }),
      book,
      prevVerse,
      nextVerse
    };
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}
