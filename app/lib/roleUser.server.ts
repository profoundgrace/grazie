import { getLogger } from '~/utils/logger.server';
import { prisma } from '~/utils/prisma.server';
import { RoleUserInput } from '~/types/RoleUser';
import { timeStamp } from '~/utils/generic.server';

const log = getLogger('Roles Query');

export async function roleUserCheck(roleId: number, userId: number) {
  return await prisma.roleUser.count({
    where: {
      roleId,
      userId
    }
  });
}

export async function createRoleUser({
  active,
  roleId,
  userId
}: RoleUserInput) {
  try {
    if (await roleUserCheck(roleId, userId)) {
      throw new Error(`Role userId ${userId} already exists`);
    }
    const date = timeStamp();

    return await prisma.roleUser.create({
      data: {
        active,
        roleId,
        userId,
        createdAt: date,
        updatedAt: date
      }
    });
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function updateRoleUser({ id, active }: RoleUserInput) {
  try {
    return await prisma.roleUser.update({
      where: { id },
      data: {
        active,
        updatedAt: timeStamp()
      }
    });
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function removeRoleUser({ id }: RoleUserInput) {
  try {
    return await prisma.roleUser.delete({
      where: { id }
    });
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}
/**
 * Get Role Users
 * @param { filter }
 * @returns
 */
export async function getRoleUsers({ roleId }: { roleId: number }) {
  try {
    const where = { roleId };

    const roleUsers = await prisma.roleUser.findMany({
      where,
      select: {
        id: true,
        active: true,
        roleId: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            email: true,
            createdAt: true,
            banned: true
          }
        }
      },
      orderBy: { user: { username: 'asc' } }
    });

    return {
      count: roleUsers.length,
      totalCount: await prisma.roleUser.count({ where }),
      nodes: roleUsers
    };
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}