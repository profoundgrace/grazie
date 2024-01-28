import { User } from '~/types/User';

export type UserSetting = {
  id?: number;
  userId?: number;
  name?: string;
  value?: string;
  type?: string;
  user?: User;
};

export type UserSettingInput = {
  userId?: number;
  name: string;
  value: string;
  type?: string;
};
