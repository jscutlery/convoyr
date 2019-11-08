import { HttpMethod } from '../../request';
import { isString } from '../../utils/is-string';
import { MethodMatcher } from './match-method-expression';

export const methodStringMatcher: MethodMatcher = {
  canHandle(matchExpression) {
    return isString(matchExpression);
  },
  handle({
    value,
    matchExpression
  }: {
    value: HttpMethod;
    matchExpression: HttpMethod;
  }) {
    return value === matchExpression;
  }
};
