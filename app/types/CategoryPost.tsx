/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { Category } from '~/types/Category';
import { Post } from '~/types/Post';

export type CategoryPost = {
  id?: number;
  catId?: number;
  postId?: number;
  category?: Category;
  post?: Post;
};

export type CategoryPostInput = {
  name?: string;
  slug?: string;
  catId?: number;
  postId?: number;
  category?: Category;
  post?: Post;
};
