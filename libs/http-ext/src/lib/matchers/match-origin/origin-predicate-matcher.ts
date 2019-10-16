import { isFunction } from '../../utils/is-function';
import { OriginMatcher } from './origin-matcher';

export type MatchOriginPredicate = (origin: string) => boolean;

export const originPredicateMatcher: OriginMatcher = {
  canHandle(matchExpression) {
    return isFunction(matchExpression);
  },
  handle({ origin, matchExpression }) {
    return (matchExpression as Function)(origin);
  }
};
