import { isString } from '../../utils/is-string';
import { Matcher } from './match-origin';

export const matchStringOrigin = (
  origin: string,
  matcher: Matcher
): boolean => {
  if (isString(matcher) && origin === matcher) {
    return true;
  }

  return false;
};
