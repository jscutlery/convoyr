import { isString } from '../../utils/is-string';
import { OriginMatcher } from './origin-match-expression';

export const originStringMatcher: OriginMatcher = {
  canHandle(matchExpression) {
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
