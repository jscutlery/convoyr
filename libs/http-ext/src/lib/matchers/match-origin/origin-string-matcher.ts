import { isString } from '../../utils/is-string';
import { OriginMatcher } from './origin-match-expression';

export const originStringMatcher: OriginMatcher = {
  canHandle(matchExpression) {
    return isString(matchExpression);
  },
  handle({
    expression,
    matchExpression
  }: {
    matchExpression: string;
    expression: string;
  }) {
    return expression === matchExpression;
  }
};
