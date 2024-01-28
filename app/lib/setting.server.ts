import { getUserByUsername } from '~/lib/user.server';
import { getLogger } from '~/utils/logger.server';
import { DataCache } from '~/utils/dataCache.server';
import { formatSlug } from '~/utils/formatSlug';
import { dateString, timeStamp, timeString } from '~/utils/generic.server';
import { prisma } from '~/utils/prisma.server';
import type { SettingInput } from '~/types/Setting';
import { getCategory } from './category.server';

const log = getLogger('Settings Query');

async function slugCheck(slug: string, id = undefined) {
  let where = { slug };
  if (id) {
    where = {
      AND: [
        { slug },
        {
          id: {
            not: id
          }
        }
      ]
    };
  }
  const slugs = await prisma.post.count({
    where
  });

  if (slugs > 0) {
    const slugs = await prisma.post.count({
      where: {
        slug: {
          startsWith: slug
        }
      }
    });
    slug = `${slug}-${slugs + 1}`;
  }

  return slug;
}

function formatSetting({ value, type }: { value: any; type: string }) {
  switch (type) {
    case 'array' || 'object':
      if (typeof value === 'object' || Array.isArray(value)) {
        return JSON.stringify(value);
      } else {
        return value as string;
      }
    case 'number':
      return Number(value);
    case 'boolean':
      return Number(Boolean(value));
    case 'string':
    default:
      return value as string;
  }
}
function outputSetting({ value, type }: { value: any; type: string }) {
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
export async function setting({ id, name, value, type }: SettingInput) {
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
    } else {
      setting = await prisma.setting.findUnique({
        where: {
          name
        }
      });
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
