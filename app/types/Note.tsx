import { NoteLabel } from './NoteLabel';

export type NoteInput = {
  id?: number;
  pinned?: boolean;
  authorId: number;
  createdAt?: number;
  updatedAt?: number;
  search?: string;
  title?: string;
  body: object | string;
  meta?: object;
};

export type Note = {
  id: string;
  pinned: boolean;
  authorId: number;
  createdAt: number;
  updatedAt: number;
  search?: string;
  title?: string;
  body: object;
  author: { displayName: string };
  labels?: NoteLabel[];
};
