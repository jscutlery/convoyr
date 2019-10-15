import { isArray } from '../../utils/is-array';
import { Matcher } from './match-origin';
import { matchStringOrigin } from './match-string-origin';

export const matchArrayOrigin = (origin: string, matchers: Matcher): boolean =>
  isArray(matchers) &&
  matchers.some(matcher => matchStringOrigin(origin, matcher));
