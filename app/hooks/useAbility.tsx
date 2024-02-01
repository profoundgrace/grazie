import { createContext, useContext } from 'react';

export const AbilityContext = createContext();

export const useAbility = () => useContext(AbilityContext);
