import { isString } from '../utils/is-string';
import { Matcher } from './match-origin';

export const matchStringOrigin = (
  origin: string,
  matcher: Matcher,
): boolean => {
  if (isString(matcher) && matcher === '*') {
    return true;
  } else if (
    isString(matcher) &&
    matcher !== '*' &&
    origin.match(matcher as string)
  ) {
    return true;
  }

  return false;
};
