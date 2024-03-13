import { Privilege } from '~/types/Privilege';
import { Role } from '~/types/Role';

export type RolePrivilege = {
  id?: number;
  roleId?: number;
  privilegeId?: number;
  inverted?: boolean;
  conditions?: string | object | null;
  description?: string;
  role?: Role;
  privilege?: Privilege;
};

export type RolePrivilegeInput = {
  id?: number;
  roleId?: number;
  privilegeId?: number;
  inverted?: boolean;
  conditions?: string | object | null;
  description?: string;
};
