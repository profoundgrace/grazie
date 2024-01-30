import { User } from './User';

export type Role = {
  id?: number;
  active?: boolean;
  name?: string;
  description?: string;
  users?: User[];
};

export type RoleInput = {
  id?: number;
  active?: boolean;
  name?: string;
  description?: string;
};
