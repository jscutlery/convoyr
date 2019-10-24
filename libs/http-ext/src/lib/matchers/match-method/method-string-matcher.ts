import { isString } from '../../utils/is-string';
import { MethodMatcher } from './match-method-expression';

export const methodStringMatcher: MethodMatcher = {
  canHandle(matchExpression) {
    return isString(matchExpression);
  },
  handle({ expression, matchExpression }) {
    return expression === matchExpression;
  }
};
