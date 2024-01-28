import { useEffect, useRef, useState } from 'react';
import { NavLink, SegmentedControl, Text } from '@mantine/core';
import {
  IconArticle,
  IconSettings,
  IconUsers,
  IconLogout,
  IconCategory2,
  IconNews
} from '@tabler/icons-react';
import classes from '~/components/Dashboard/Navbar.module.css';
import { Link, useMatches, useNavigate } from '@remix-run/react';
import useUser from '~/hooks/useUser';

const tabs = {
  account: [
    { link: '/dashboard/settings', label: 'Settings', icon: IconSettings }
  ],
  system: [
    {
      link: '/dashboard/admin/categories',
      label: 'Categories',
      icon: IconCategory2,
      links: []
    },
    {
      link: '/dashboard/admin/posts',
      label: 'Posts',
      icon: IconNews,
      links: []
    },
    {
      link: '/dashboard/admin/pages',
      label: 'Pages',
      icon: IconArticle,
      links: []
    },
    {
      link: '/dashboard/admin/users',
      label: 'Users',
      icon: IconUsers,
      links: []
    },
    {
      link: '/dashboard/admin/settings',
      label: 'Settings',
      icon: IconSettings,
      links: []
    }
  ]
};

export default function Navbar() {
  const [section, setSection] = useState<'account' | 'system'>('account');
  const [active, setActive] = useState('Billing');
  const matches = useMatches();
  const { id } = matches[matches.length - 1];
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (id.includes('dashboard.admin')) {
      setSection('system');
    }
    if (!id.includes('dashboard.admin')) {
      setSection('account');
    }
  }, [id]);

  useEffect(() => {
    if (section === 'system') {
      navigate('/dashboard/admin');
    }
    if (section === 'account') {
      navigate('/dashboard');
    }
  }, [navigate, section]);

  const links = tabs[section].map((item) => (
    <Link
      className={classes.link}
      data-active={item.label === active || undefined}
      to={item.link}
      key={item.label}
      onClick={() => setActive(item.label)}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div>
        <Text
          fw={500}
          size="sm"
          className={classes.title}
          c="dimmed"
          mb="xs"
          ta="center"
        >
          {user.email}
        </Text>

        <SegmentedControl
          value={section}
          onChange={(value: any) => setSection(value)}
          transitionTimingFunction="ease"
          fullWidth
          data={[
            { label: 'Account', value: 'account' },
            { label: 'System', value: 'system' }
          ]}
        />
      </div>

      <div className={classes.navbarMain}>{links}</div>

      <div className={classes.footer}>
        {/*<Link
          to="#"
          className={classes.link}
        >
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </Link>*/}

        <Link to="/logout" className={classes.link}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </Link>
      </div>
    </nav>
  );
}
