import type { DocumentSelector } from 'arangojs/documents';
import type { Article } from '~/interfaces/Article';
import type { ArticleType } from '~/interfaces/ArticleType';
export type CommentInput = {
  id?: DocumentSelector | string | null;
  articleId: string;
  articleTypeId: string;
  images?: {
    base64?: string;
    description?: string;
    file?: string;
    name?: string;
  }[];
  parentId: string | null;
  path?: string | null;
  status: string;
  text: object;
  title: string;
  userId: string;
};

export type Comment = {
  id: string;
  article: Article;
  articleId: string;
  articleType: ArticleType;
  articleTypeId: string;
  createdAt: string;
  parentId: string | null;
  path: string;
  slug: string;
  status: string;
  text: object;
  title: string;
  updatedAt: string;
  userId: string;
  user: { username: string };
};
