import { createTheme } from '@mantine/core';
import { Page } from '~/themes/favorite/pages/Page';
import { Dashboard } from '~/themes/favorite/pages/Dashboard';
import './styles/Styles.css';

export const Theme = {
  Page,
  Dashboard,
  theme: createTheme({
    primaryColor: 'cyan',
    headings: {
      fontFamily: 'Greycliff CF, var(--mantine-font-family)'
    }
  })
};

export default Page;
