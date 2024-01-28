import { createContext, useContext } from 'react';

export type ThemeContextType = {
  theme?: string;
  page?: string;
  setPage?: Function;
  setTheme?: Function;
  data?: { navbar: { links: { to: string; label: string } } };
};

export const ThemeContext = createContext<ThemeContextType>({});

export const useTheme = () => useContext(ThemeContext);
