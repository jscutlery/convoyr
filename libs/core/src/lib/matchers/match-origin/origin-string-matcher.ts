import { isString } from '../../utils/is-string';
import { OriginMatcher } from './origin-match-expression';

export const originStringMatcher: OriginMatcher = {
  canHandle(matchExpression) {
    return isString(matchExpression);
  },
  handle({
    value,
    matchExpression
  }: {
    matchExpression: string;
    value: string;
  }) {
    return value === matchExpression;
  }
};
