export interface UserInput {
  id?: number | null;
  createdAt?: string;
  username: string;
}

export interface User {
  id?: number | null | undefined;
  createdAt?: string;
  updatedAt?: string;
  username?: string;
  displayName?: string | null;
  image?: string;
  avatar?: { sm?: string | null; md?: string | null; lg?: string | null };
  email?: string;
  isLoggedIn?: boolean;
}

export type UserLogin = {
  email: string;
  password: string;
};

export type UserSystem = {
  displayName?: string;
  username?: string;
  email?: string;
  password?: string;
};
