import { getLogger } from '~/utils/logger.server';
import { prisma } from '~/utils/prisma.server';
import type { PrivilegeInput } from '~/types/Privilege';

const log = getLogger('Privileges Query');

export async function privilegeCheck(
  subject: string,
  action: string,
  id: undefined
) {
  const where = id
    ? {
        AND: [
          { subject },
          { action },
          {
            id: {
              not: id
            }
          }
        ]
      }
    : { subject, action };

  return await prisma.privilege.count({
    where
  });
}

export async function createPrivilege({ subject, action }: PrivilegeInput) {
  try {
    if (await privilegeCheck(subject, action)) {
      throw new Error(
        `Privilege subject ${subject} / action ${action} already exists`
      );
    }

    return await prisma.privilege.create({
      data: {
        subject,
        action
      }
    });
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function updatePrivilege({ id, subject, action }: PrivilegeInput) {
  try {
    if (await privilegeCheck(subject, action, id)) {
      throw new Error(
        `Privilege subject ${subject} / action ${action} already exists`
      );
    }

    return await prisma.privilege.update({
      where: { id },
      data: {
        subject,
        action
      }
    });
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}
/**
 * Get Privileges
 * @param { filter }
 * @returns
 */
export async function getPrivileges({
  filter = {},
  limit = 25,
  offset = 0
}: {
  filter?: { group?: string };
  limit?: number;
  offset?: number;
}) {
  try {
    const where = {};

    const privileges = await prisma.privilege.findMany({
      where,
      select: {
        id: true,
        subject: true,
        action: true,
        roles: {
          select: {
            id: true,
            role: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: [{ subject: 'asc' }, { action: 'asc' }],
      take: limit > 0 ? limit : undefined,
      skip: offset
    });

    return {
      count: privileges.length,
      totalCount: await prisma.privilege.count({ where }),
      nodes: privileges
    };
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}
