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
