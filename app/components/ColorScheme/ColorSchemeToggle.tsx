import cx from 'clsx';
import {
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  Group
} from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import classes from './ColorSchemeButton.module.css';
import { useEffect, useRef, useState } from 'react';
import TimedGridOverlay from '../Transitions/GridOverlay';

export function ColorSchemeToggle({
  transition = false,
  duration,
  fadeOutDuration
}: {
  transition?: boolean;
  duration?: number;
  fadeOutDuration?: number;
}) {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true
  });

  const [startTransition, setStartTransition] = useState(false);
  const colorRef = useRef(computedColorScheme);
  useEffect(() => {
    if (transition && colorRef.current !== computedColorScheme) {
      setStartTransition(true);
      colorRef.current = computedColorScheme;
    }
  }, [computedColorScheme]);

  return (
    <>
      <Group justify="center">
        <ActionIcon
          onClick={() =>
            setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')
          }
          variant="default"
          size="xl"
          aria-label="Toggle color scheme"
        >
          <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
          <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
        </ActionIcon>
      </Group>
      {startTransition && (
        <TimedGridOverlay
          duration={duration ?? 1500}
          fadeOutDuration={fadeOutDuration ?? 1000}
          onFadeOutEnd={() => setStartTransition(false)}
        />
      )}
    </>
  );
}
