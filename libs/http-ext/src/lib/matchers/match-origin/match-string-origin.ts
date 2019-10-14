import { isString } from '../../utils/is-string';
import { Matcher } from './match-origin';

const isWildcard = (value: any): value is '*' =>
  isString(value) && value === '*';

export const matchStringOrigin = (
  origin: string,
  matcher: Matcher
): boolean => {
  if (isWildcard(matcher)) {
    return true;
  }
  if (isString(matcher) && origin === matcher) {
    return true;
  }

  return false;
};
