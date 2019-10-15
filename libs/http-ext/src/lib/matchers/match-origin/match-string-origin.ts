import { isString } from '../../utils/is-string';
import { Matcher } from './match-origin';

export const matchStringOrigin = (
  origin: string,
  matcher: Matcher
): boolean => isString(matcher) && matcher === origin;
