import { isString } from '../../utils/is-string';
import { OriginMatchExpression } from './origin-match-expression';
import { OriginMatcher } from './origin-matcher';

export const matchStringOrigin = (
  origin: string,
  matcher: OriginMatchExpression
): boolean => isString(matcher) && matcher === origin;

export const originStringMatcher: OriginMatcher = {
  canHandle(matchExpression: OriginMatchExpression) {
    return isString(matchExpression);
  },
  handle({
    origin,
    matchExpression
  }: {
    matchExpression: string;
    origin: string;
  }) {
    return origin === matchExpression;
  }
};
