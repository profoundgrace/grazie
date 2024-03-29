/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
export type CurrentUser = {
  id?: number;
  name?: string;
  admin?: boolean;
  isLoggedIn?: boolean;
  login?: string;
  avatarUrl?: string;
};
