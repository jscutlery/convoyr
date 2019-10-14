import { isArray } from '../../utils/is-array';
import { Matcher } from './match-origin';

export const matchArrayOrigin = (origin: string, matcher: Matcher): boolean =>
  isArray(matcher) && matcher.includes(origin) ? true : false;
