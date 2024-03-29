/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import useMatchesData from '~/hooks/useMatchesData';
import type { User } from '~/types/User';

function isUser(user: any): user is User {
  return user && typeof user === 'object' && typeof user.id === 'number';
}

export default function useUser(): User | undefined {
  const data = useMatchesData('root');
  if (!data || !isUser(data.user)) {
    return {
      isLoggedIn: false,
      displayName: 'Guest',
      username: 'Guest',
      avatar: { sm: null, md: null, lg: null }
    };
  }
  return data.user;
}
