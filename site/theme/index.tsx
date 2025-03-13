import { createTheme } from '@mantine/core';
import { Page } from '!~/theme/pages/Page';
import { Dashboard } from '!~/theme/pages/Dashboard';
import '!~/theme/styles/Styles.css';

export const Theme = {
  Page,
  Dashboard,
  theme: createTheme({
    colors: {
      silver: [
        '#e6f8ff',
        '#dcebf1',
        '#bfd3db',
        '#9ebac5',
        '#83a5b2',
        '#7097a6',
        '#6591a2',
        '#537e8e',
        '#457080',
        '#326272'
      ]
    },
    primaryColor: 'silver',
    headings: {
      fontFamily: 'Greycliff CF, var(--mantine-font-family)'
    }
  })
};

export default Page;
