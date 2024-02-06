import { Anchor, AppShell, Box, Burger, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link } from '@remix-run/react';
import type { ReactNode } from 'react';
import Navbar from '~/components/Dashboard/Navbar';
import { Footer } from '~/themes/favorite/components/Footer';
import { Header } from '~/themes/favorite/components/Header';
import { useTheme } from '~/hooks/useTheme';

export function Page({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <Box p={15}>{children}</Box>
      <Footer />
    </>
  );
}

export function Dashboard({ children }: { children: ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const {
    data: { site }
  } = useTheme();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Anchor component={Link} to="/" underline="never">
            <Text
              gradient={{ from: 'indigo', to: 'blue', deg: 90 }}
              fw={500}
              size="xl"
              variant="gradient"
            >
              {site?.name ?? 'Site Name'}
            </Text>
          </Anchor>
          <Text fw={500} size="xl">
            Dashboard
          </Text>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

export const Theme = {
  Page,
  Dashboard
};

export default Page;
