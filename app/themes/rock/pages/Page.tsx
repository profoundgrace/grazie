import { Box } from '@mantine/core';
import type { ReactNode } from 'react';
import { Footer } from '~/themes/rock/components/Footer';
import { Header } from '~/themes/rock/components/Header';

export function Page({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <Box p={15}>{children}</Box>
      <Footer />
    </>
  );
}
