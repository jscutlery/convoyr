import { isString } from '../../utils/is-string';
import { MethodMatcher } from './match-method-expression';

export const methodStringMatcher: MethodMatcher = {
  canHandle(matchExpression) {
    return isString(matchExpression);
  },
  handle({ method, matchExpression }) {
    return matchExpression === method;
  }
};
