import { OriginMatcher } from './origin-match-expression';

export const originRegExpMatcher: OriginMatcher = {
  canHandle(matchExpression) {
    return matchExpression instanceof RegExp;
  },
  handle({
    value,
    matchExpression
  }: {
    value: string;
    matchExpression: RegExp;
  }) {
    return matchExpression.test(value);
  }
};
