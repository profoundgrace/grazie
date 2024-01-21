import { Box } from '@mantine/core';
import type { ReactNode } from 'react';

import { Footer } from '~/themes/favorite/components/Footer';
import { Header } from '~/themes/favorite/components/Header';

export function Page({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <Box p={15}>{children}</Box>
      <Footer />
    </>
  );
}

export const Theme = {
  Page
};

export default Page;
