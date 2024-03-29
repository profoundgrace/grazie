/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { CategoryPost } from './CategoryPost';

export interface PostInput {
  id?: number;
  authorId: number;
  published?: boolean;
  createdAt?: number;
  publishedAt: number;
  updatedAt?: number;
  title: string;
  slug?: string;
  slugFormat?: string;
  search?: string;
  body: object | string;
  meta?: object;
}

export interface Post {
  id: string;
  authorId: number;
  published: boolean;
  createdAt: number;
  publishedAt: number;
  updatedAt: number;
  title: string;
  slug: string;
  search?: string;
  body: object;
  author: { displayName: string };
  categories?: CategoryPost[];
}
