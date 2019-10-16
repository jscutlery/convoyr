import { OriginMatcher } from './origin-matcher';

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
