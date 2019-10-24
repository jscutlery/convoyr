import { isFunction } from '../../utils/is-function';
import { OriginMatcher } from './origin-match-expression';

export type MatchOriginPredicate = (origin: string) => boolean;

export const originPredicateMatcher: OriginMatcher = {
  canHandle(matchExpression) {
    return isFunction(matchExpression);
  },
  handle({
    expression,
    matchExpression
  }: {
    expression: string;
    matchExpression: MatchOriginPredicate;
  }) {
    return matchExpression(expression);
  }
};
