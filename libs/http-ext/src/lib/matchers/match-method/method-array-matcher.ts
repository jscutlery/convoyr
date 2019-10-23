import { HttpMethod } from '../../request';
import { isArray } from '../../utils/is-array';
import { MethodMatcher } from './match-method-expression';

export const methodArrayMatcher: MethodMatcher = {
  canHandle(matchExpression) {
    return isArray(matchExpression);
  },
  handle({ method, matchExpression }) {
    return matchExpression.includes(method as HttpMethod);
  }
};
