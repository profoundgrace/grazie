/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { Group, Collapse, Box, ActionIcon, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBug, IconX } from '@tabler/icons-react';
import { Debug } from '~/components/Debug';

export function DebugCollapse({ data }: { data: object }) {
  const [opened, { toggle }] = useDisclosure(false);
  return (
    <Box>
      <Group justify="right">
        <Tooltip label={!opened ? 'Debug Data' : 'Close Debug'}>
          <ActionIcon onClick={toggle} variant="subtle">
            {!opened ? <IconBug /> : <IconX />}
          </ActionIcon>
        </Tooltip>
      </Group>
      <Collapse in={opened}>
        <Debug data={data} />
      </Collapse>
    </Box>
  );
}
