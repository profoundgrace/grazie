import { useState } from 'react';
import { ThemeContext } from '~/hooks/useTheme';
import { theme, page, Theme, Pages } from '@/grazie';

export function ThemeProvider({
  children,
  defaultTheme = theme,
  defaultPage = page
}) {
  const [theme, setTheme] = useState(defaultTheme);
  const [page, setPage] = useState(defaultPage);
  const Page =
    page !== defaultPage ? Theme[page] : Theme[Pages?.root ?? defaultPage];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, page, setPage }}>
      <Page>{children}</Page>
    </ThemeContext.Provider>
  );
}
