import { RolePrivilege } from '~/types/RolePrivilege';

export type Privilege = {
  id?: number;
  subject?: string;
  action?: string;
  roles?: RolePrivilege[];
};

export type PrivilegeInput = {
  id?: number;
  subject?: string;
  action?: string;
};
