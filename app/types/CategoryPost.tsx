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
