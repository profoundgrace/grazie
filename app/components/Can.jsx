import { createContextualCan } from '@casl/react';
import { AbilityContext } from '~/hooks/useAbility';

export const Can = createContextualCan(AbilityContext.Consumer);
