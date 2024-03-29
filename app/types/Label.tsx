/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
export type LabelInput = {
  id?: number;
  createdAt?: number;
  updatedAt?: number;
  name: string;
  slug?: string;
  description?: string;
};

export type Label = {
  id: string;
  createdAt: number;
  updatedAt: number;
  notesCount?: number;
  name: string;
  slug: string;
  description?: string;
};
