/**
 * Grazie
 * @package Resource Library
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { currentLoad, mem, osInfo } from 'systeminformation';

function formatToGb(value: number) {
  return Math.round(value / 1000000000);
}

export async function system() {
  const cpu = await currentLoad();
  const memory = await mem();

  return {
    cpu: Math.round(cpu.currentLoad),
    memory: {
      total: formatToGb(memory.total),
      used: formatToGb(memory.used),
      active: formatToGb(memory.active),
      available: formatToGb(memory.available)
    },
    os: await osInfo()
  };
}
