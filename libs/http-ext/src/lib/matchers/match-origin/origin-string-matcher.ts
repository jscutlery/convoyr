import { isString } from '../../utils/is-string';
import { OriginMatchExpression } from './origin-match-expression';
import { OriginMatcher } from './origin-matcher';

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
