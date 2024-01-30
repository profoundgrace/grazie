import { getLogger } from '~/utils/logger.server';
import { prisma } from '~/utils/prisma.server';
import type { RoleInput } from '~/types/Role';

const log = getLogger('Roles Query');

export async function roleCheck(name: string, id = undefined) {
  const where = id
    ? {
        AND: [
          { name },
          {
            id: {
              not: id
            }
          }
        ]
      }
    : { name };

  return await prisma.role.count({
    where
  });
}

export async function createRole({ active, name, description }: RoleInput) {
  try {
    if (await roleCheck(name)) {
      throw new Error(`Role name ${name} already exists`);
    }

    return await prisma.role.create({
      data: {
        active,
        name,
        description
      }
    });
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function updateRole({ id, active, name, description }: RoleInput) {
  try {
    console.log(id);
    console.log(name);
    if (await roleCheck(name, id)) {
      throw new Error(`Role name ${name} already exists`);
    }

    return await prisma.role.update({
      where: { id },
      data: {
        active,
        name,
        description
      }
    });
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}
/**
 * Get Roles
 * @param { filter }
 * @returns
 */
export async function getRoles({
  filter = {}
}: {
  filter?: { group?: string };
}) {
  try {
    const where = {};

    const roles = await prisma.role.findMany({
      where,
      select: {
        id: true,
        active: true,
        name: true,
        description: true,
        users: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                username: true,
                displayName: true
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    return {
      count: roles.length,
      totalCount: await prisma.role.count({ where }),
      nodes: roles
    };
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}