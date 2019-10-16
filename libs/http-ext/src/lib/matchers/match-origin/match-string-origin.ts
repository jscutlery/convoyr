import { isString } from '../../utils/is-string';
import { OriginMatchExpression } from './origin-match-expression';

export const matchStringOrigin = (
  origin: string,
  matcher: OriginMatchExpression
): boolean => isString(matcher) && matcher === origin;

export const originStringMatcher = {
  canHandle(expression: OriginMatchExpression) {
    return isString(expression);
  },
  handle({ origin, expression }: { expression: string; origin: string }) {
    return origin === expression;
  }
};
