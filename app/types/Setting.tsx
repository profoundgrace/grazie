/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
export type Setting = {
  id?: number;
  name?: string;
  value?: string | number;
  type?: string;
};

export type SettingInput = {
  id?: number;
  name: string;
  value?: string | number | object | boolean;
  type?: string;
  group?: boolean;
  defaultValue?: string | number | object | boolean;
};
