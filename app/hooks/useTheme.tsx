import { createContext, useContext } from 'react';

export type ThemeContextType = {
  theme?: string;
  page?: string;
  setPage?: Function;
  setTheme?: Function;
};

export const ThemeContext = createContext<ThemeContextType>({});

export const useTheme = () => useContext(ThemeContext);
