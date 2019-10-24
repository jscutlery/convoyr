import { OriginMatcher } from './origin-match-expression';

export const originRegExpMatcher: OriginMatcher = {
  canHandle(matchExpression) {
    return matchExpression instanceof RegExp;
  },
  handle({
    expression,
    matchExpression
  }: {
    expression: string;
    matchExpression: RegExp;
  }) {
    return matchExpression.test(expression);
  }
};
