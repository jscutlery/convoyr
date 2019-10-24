import { isArray } from '../../utils/is-array';
import { MethodMatcher } from './match-method-expression';

export const methodArrayMatcher: MethodMatcher = {
  canHandle(matchExpression) {
    return isArray(matchExpression);
  },
  handle({ expression, matchExpression }) {
    return matchExpression.includes(expression);
  }
};
