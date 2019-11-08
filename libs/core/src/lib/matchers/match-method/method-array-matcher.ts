import { HttpMethod } from '../../request';
import { isArray } from '../../utils/is-array';
import { MethodMatcher } from './match-method-expression';

export const methodArrayMatcher: MethodMatcher = {
  canHandle(matchExpression: HttpMethod[]) {
    return isArray(matchExpression);
  },
  handle({
    value,
    matchExpression
  }: {
    value: HttpMethod;
    matchExpression: HttpMethod[];
  }) {
    return matchExpression.includes(value);
  }
};
