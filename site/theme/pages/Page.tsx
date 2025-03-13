import { Box } from '@mantine/core';
import type { ReactNode } from 'react';
import { Footer } from '!~/theme/components/Footer';
import { Header } from '!~/theme/components/Header';

export function Page({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <Box p={15}>{children}</Box>
      <Footer />
    </>
  );
}
