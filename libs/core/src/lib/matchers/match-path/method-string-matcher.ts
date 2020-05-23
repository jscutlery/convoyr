import { isString } from '../../utils/is-string';
import { PathMatcher } from './match-path-expression';

export const removeTrailingSlash = (expression: string): string => {
  if (expression.endsWith('/')) {
    return expression.substring(0, expression.length - 1);
  }

  return expression;
};

export const pathStringMatcher: PathMatcher = {
  canHandle(matchExpression) {
    return isString(matchExpression);
  },
  handle({
    value,
    matchExpression,
  }: {
    value: string;
    matchExpression: string;
  }) {
    return removeTrailingSlash(value) === removeTrailingSlash(matchExpression);
  },
};
