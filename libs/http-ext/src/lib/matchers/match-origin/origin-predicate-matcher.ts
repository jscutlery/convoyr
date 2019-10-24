import { isFunction } from '../../utils/is-function';
import { OriginMatcher } from './origin-match-expression';

export type MatchOriginPredicate = (origin: string) => boolean;

export const originPredicateMatcher: OriginMatcher = {
  canHandle(matchExpression) {
    return isFunction(matchExpression);
  },
  handle({
    value,
    matchExpression
  }: {
    value: string;
    matchExpression: MatchOriginPredicate;
  }) {
    return matchExpression(value);
  }
};
