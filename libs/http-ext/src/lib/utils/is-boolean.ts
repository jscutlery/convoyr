import { isTypeof } from './is-typeof';

export const isBoolean = (value: any): value is boolean =>
  isTypeof('boolean')(value);
