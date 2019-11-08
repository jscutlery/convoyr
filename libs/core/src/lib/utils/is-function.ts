import { isTypeof } from './is-typeof';

export const isFunction = (value: any): value is Function =>
  isTypeof('function')(value);
