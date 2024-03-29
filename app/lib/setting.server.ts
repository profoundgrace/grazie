/**
 * Grazie
 * @package Setting Library
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { getLogger } from '~/utils/logger.server';
import { DataCache } from '~/utils/dataCache.server';
import { prisma } from '~/utils/prisma.server';
import type { SettingInput } from '~/types/Setting';

const log = getLogger('Settings Query');

function findType(value: any) {
  if (typeof value === 'object') {
    return 'object';
  } else if (Array.isArray(value)) {
    return 'array';
  } else if (typeof value === 'number') {
    return 'number';
  } else if (typeof value === 'string') {
    return 'string';
  } else if (typeof value === 'boolean') {
    return 'boolean';
  }
}

function formatSetting({ value, type }: { value: any; type?: string }) {
  if (!type) {
    type = findType(value);
  }
  switch (type) {
    case 'array' || 'object':
      if (typeof value === 'object' || Array.isArray(value)) {
        return JSON.stringify(value);
      } else {
        return value as string;
      }
    case 'number':
      return value as string;
    case 'boolean':
      return value as string;
    case 'string':
    default:
      return value as string;
  }
}
function outputSetting({ value, type }: { value: any; type?: string }) {
  if (!type) {
    type = findType(value);
  }

  switch (type) {
    case 'array' || 'object':
      if (typeof value === 'object' || Array.isArray(value)) {
        return value;
      } else {
        return JSON.parse(value);
      }
    case 'number':
      return Number(value);
    case 'boolean':
      return Boolean(value);
    case 'string':
    default:
      return value as string;
  }
}
/**
 * Set or Return Setting
 *
 * Utilizes DataCacheService to Cache Settings are they are used
 * @param { name, value, type }
 * @returns value as type
 */
export async function setting({
  id,
  name,
  value,
  type,
  group,
  defaultValue
}: SettingInput) {
  try {
    if (name && !value) {
      const cache = DataCache.get(`setting.${name}`);
      if (cache) {
        log.info(`Using cached setting ${name}`);
        return cache;
      }
    }

    let setting;
    if (value) {
      if (!type) {
        type = await prisma.setting.findUnique({
          where: {
            name
          },
          select: {
            type: true
          }
        });
      }
      const data = {
        name,
        value: formatSetting({ value, type: type ?? 'string' }),
        type
      };
      if (id) {
        setting = await prisma.setting.update({
          where: {
            id
          },
          data
        });
      } else {
        setting = await prisma.setting.upsert({
          where: { name },
          update: {
            value: formatSetting({ value, type: type ?? 'string' }),
            type: type ? type : undefined
          },
          create: data
        });
      }
      const nameArray = name.split('.');
      if (nameArray.length > 1) {
        const nameKey = nameArray.pop();
        const groupCache = DataCache.get(`setting.${nameArray}`);

        log.info(`Updated ${nameArray} cache`);
        if (groupCache) {
          DataCache.update(`setting.${nameArray}`, nameKey, setting.value);
        }
      }
    } else {
      if (group) {
        const settings = await prisma.setting.findMany({
          where: {
            name: {
              startsWith: `${name}.`
            }
          }
        });
        if (!settings) {
          if (defaultValue) {
            setting = { value: defaultValue };
          } else {
            throw new Error(
              `Setting ${name} doesn't exist and no default (defaultValue: ${defaultValue}) was provided`
            );
          }
        }
        setting = {};
        for (const set of settings) {
          const setName = set.name.replace(`${name}.`, '');
          setting = {
            ...setting,
            [setName]: outputSetting({ value: set?.value, type: set.type })
          };
        }
        log.info(`Cached setting ${name}`);
        return DataCache.set(`setting.${name}`, setting);
      } else {
        setting = await prisma.setting.findUnique({
          where: {
            name
          }
        });
      }

      if (!setting) {
        if (defaultValue) {
          setting = { value: defaultValue };
        } else {
          throw new Error(
            `Setting ${name} doesn't exist and no default (defaultValue: ${defaultValue}) was provided`
          );
        }
      }
      type = setting?.type;
    }
    log.info(`Cached setting ${name}`);
    return DataCache.set(
      `setting.${name}`,
      outputSetting({ value: setting?.value, type })
    );
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}
/**
 * Get Settings
 * @param { filter }
 * @returns
 */
export async function getSettings({
  filter = {}
}: {
  filter?: { group?: string };
}) {
  try {
    const where = {};

    const settings = await prisma.setting.findMany({
      where,
      select: {
        id: true,
        name: true,
        value: true,
        type: true
      },
      orderBy: { name: 'asc' }
    });

    return {
      count: settings.length,
      totalCount: await prisma.setting.count({ where }),
      nodes: settings
    };
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}
