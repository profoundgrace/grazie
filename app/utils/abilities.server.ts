import { getUserRoles } from '~/lib/user.server';
import { Privilege } from '~/types/Privilege';
import { RolePrivilege } from '~/types/RolePrivilege';
import { RoleUser } from '~/types/RoleUser';
import { getLogger } from '~/utils/logger.server';

const log = getLogger('Abilities Utility');

/**
 * Apply Privilege Masks
 *
 * Matches rules assigned to Role Permissions and translates them for CASL verification
 * @param array abilities
 * @param int userId
 * @returns array abilities
 */
export const applyMasks = (abilities, userId) => {
  abilities.forEach((rule, key) => {
    switch (rule?.conditions?.owner) {
      case 'id':
        abilities[key] = {
          ...rule,
          conditions: {
            id: userId
          }
        };
        break;
      case 'userId':
        abilities[key] = {
          ...rule,
          conditions: {
            userId
          }
        };
        break;
      default:
        break;
    }
  });
  return abilities;
};

/**
 * CASL-compatible Object for defining abilities
 * @param integer user_id
 * @returns array[object, ...] abilities
 */
export async function abilityBuilder({
  userRoles,
  userId
}: {
  userRoles?: RoleUser;
  userId: number;
}) {
  try {
    if (!userRoles) {
      userRoles = await getUserRoles({ userId });
    }
    const abilities = [] as RoleUser[];

    // Builds the abilities array as { subject, action }
    await userRoles.forEach((userRole) => {
      if (userRole?.role?.privileges) {
        userRole.role.privileges.forEach((priv: RolePrivilege) => {
          const rules = {
            action: priv?.privilege?.action,
            subject: priv?.privilege?.subject,
            conditions:
              typeof priv?.conditions === 'string'
                ? JSON.parse(priv?.conditions)
                : null,
            inverted: priv?.inverted
          };

          abilities.push(rules);
        });
      }
    });
    // Translate masks and return abilities
    return applyMasks(abilities, userId);
  } catch (err) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}
