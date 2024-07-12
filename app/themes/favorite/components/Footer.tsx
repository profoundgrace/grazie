import { Group, ActionIcon, rem, Text } from '@mantine/core';
import {
  IconBrandTwitter,
  IconBrandYoutube,
  IconBrandInstagram
} from '@tabler/icons-react';
import { site as defaultSite } from '@/grazie';
import classes from '~/themes/favorite/styles/Footer.module.css';
import { FooterLinks } from '~/components/FooterLinks';
import { SocialIcons } from '~/components/SocialIcons';
import { useTheme } from '~/hooks/useTheme';
import { ColorSchemeToggle } from '~/components/ColorScheme/ColorSchemeToggle';

export function Footer() {
  const {
    data: { site }
  } = useTheme();
  return (
    <div className={classes.footer}>
      <div className={classes.inner}>
        <Text fw={500} size="md">
          {site?.name ?? defaultSite?.name ?? 'Site Name'}
          <Text size="xs" color="dimmed">
            Copyright &copy;{' '}
            {site?.copyright ?? defaultSite?.copyright ?? 'Copyright'}
          </Text>
        </Text>
        <Group className={classes.links}>
          <FooterLinks />
        </Group>
        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <SocialIcons />{' '}
          <ColorSchemeToggle duration={2000} fadeOutDuration={6000} />
        </Group>
      </div>
    </div>
  );
}

export default Footer;
