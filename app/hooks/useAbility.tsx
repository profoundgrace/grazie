/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
export { subject } from '@casl/ability';
import { createContext, useContext } from 'react';

export const AbilityContext = createContext();

export const useAbility = () => useContext(AbilityContext);
