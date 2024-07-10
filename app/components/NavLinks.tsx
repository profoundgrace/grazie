/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { subject, useAbility } from '~/hooks/useAbility';
import { Link } from '@remix-run/react';
import { useTheme } from '~/hooks/useTheme';
import { Fragment } from 'react/jsx-runtime';

export function NavLinks({ className = undefined }: { className?: string }) {
  const {
    data: { navbar }
  } = useTheme();
  const ability = useAbility();
  const { links } = navbar ?? { links: [] };
  return (
    Array.isArray(links) &&
    links?.length > 0 && (
      <>
        {links?.map((navlink, index) => (
          <Fragment key={`navlink-${index}`}>
            {navlink?.ability ? (
              <>
                {ability.can(
                  navlink.ability.action,
                  subject(navlink.ability.subject, navlink?.ability?.item ?? {})
                ) && (
                  <Link to={navlink.to} className={className}>
                    {navlink.label}
                  </Link>
                )}
              </>
            ) : (
              <Link
                key={`navlink-${index}`}
                to={navlink.to}
                className={className}
              >
                {navlink.label}
              </Link>
            )}
          </Fragment>
        ))}
      </>
    )
  );
}
