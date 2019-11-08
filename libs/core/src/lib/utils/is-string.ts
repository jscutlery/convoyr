import { isTypeof } from './is-typeof';

export const isString = (value: any): value is string =>
  isTypeof('string')(value);
