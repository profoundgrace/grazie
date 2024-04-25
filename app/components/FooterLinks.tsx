import { subject, useAbility } from '~/hooks/useAbility';
import { Link } from '@remix-run/react';
import { useTheme } from '~/hooks/useTheme';
import { Fragment } from 'react/jsx-runtime';
import { Anchor } from '@mantine/core';

export function FooterLinks() {
  const {
    data: { navbar }
  } = useTheme();
  const ability = useAbility();
  return (
    <>
      {navbar?.links?.map((link, index) => (
        <Fragment key={`footer-link-${index}`}>
          {link?.ability ? (
            <>
              {ability.can(
                link.ability.action,
                subject(link.ability.subject, link?.ability?.item ?? {})
              ) && (
                <Anchor
                  component={Link}
                  c="dimmed"
                  key={link.label}
                  to={link.to}
                  lh={1}
                  size="sm"
                >
                  {link.label}
                </Anchor>
              )}
            </>
          ) : (
            <Anchor
              component={Link}
              c="dimmed"
              key={link.label}
              to={link.to}
              lh={1}
              size="sm"
            >
              {link.label}
            </Anchor>
          )}
        </Fragment>
      ))}
    </>
  );
}
