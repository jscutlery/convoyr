import { isArray } from '../../utils/is-array';
import { originStringMatcher } from './match-string-origin';
import { OriginMatchExpression } from './origin-match-expression';

export const matchArrayOrigin = (
  origin: string,
  matchers: OriginMatchExpression
): boolean =>
  isArray(matchers) &&
  matchers.some(matchExpression =>
    originStringMatcher.handle({ origin, matchExpression })
  );
