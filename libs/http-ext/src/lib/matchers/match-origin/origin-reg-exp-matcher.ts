import { OriginMatcher } from './origin-match-expression';

export const originRegExpMatcher: OriginMatcher = {
  canHandle(matchExpression) {
    return matchExpression instanceof RegExp;
  },
  handle({
    origin,
    matchExpression
  }: {
    origin: string;
    matchExpression: RegExp;
  }) {
    return matchExpression.test(origin);
  }
};
