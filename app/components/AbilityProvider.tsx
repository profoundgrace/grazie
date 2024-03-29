/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { createMongoAbility } from '@casl/ability';
import { ReactNode } from 'react';
import { AbilityContext } from '~/hooks/useAbility';
import useMatchesData from '~/hooks/useMatchesData';

export function AbilityProvider({ children }: { children: ReactNode }) {
  const data = useMatchesData('root');
  const ability = createMongoAbility(data?.user?.abilities ?? []);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}
