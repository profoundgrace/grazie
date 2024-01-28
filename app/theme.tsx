import { ReactNode, useState } from 'react';
import { ThemeContext } from '~/hooks/useTheme';
import { theme, page, Theme, Pages } from '@/grazie';
import { useMatches, useRouteLoaderData } from '@remix-run/react';
import useMatchesData from './hooks/useMatchesData';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const matches = useMatches();
  const { id } = matches[matches.length - 1];
  const loader = useRouteLoaderData(id);
  const [_theme, setTheme] = useState(theme);
  const [_page, setPage] = useState('root');
  console.log(loader?._page);
  if (loader && loader?._page !== _page) {
    setPage(loader._page);
  }
  const Page = Theme?.[Pages?.[_page] ?? Theme?.[Pages?.[_page]] ?? page];
  const { theme: data } = useMatchesData('root');

  return (
    <ThemeContext.Provider value={{ theme, setTheme, page, setPage, data }}>
      <Page>{children}</Page>
    </ThemeContext.Provider>
  );
}
