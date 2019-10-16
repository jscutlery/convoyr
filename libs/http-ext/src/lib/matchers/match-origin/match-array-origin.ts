import { isArray } from '../../utils/is-array';
import { OriginMatchExpression } from './origin-match-expression';
import { originStringMatcher } from './origin-string-matcher';

export const matchArrayOrigin = (
  origin: string,
  matchers: OriginMatchExpression
): boolean =>
  isArray(matchers) &&
  matchers.some(matchExpression =>
    originStringMatcher.handle({ origin, matchExpression })
  );
