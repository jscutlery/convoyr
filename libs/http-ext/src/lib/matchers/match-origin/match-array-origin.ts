import { isArray } from '../../utils/is-array';
import { OriginMatchExpression } from './origin-match-expression';
import { matchStringOrigin } from './match-string-origin';

export const matchArrayOrigin = (
  origin: string,
  matchers: OriginMatchExpression
): boolean =>
  isArray(matchers) &&
  matchers.some(matcher => matchStringOrigin(origin, matcher));
