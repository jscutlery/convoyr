import { OriginMatcher } from './origin-matcher';
import { originPredicateMatcher } from './origin-predicate-matcher';
import { originRegExpMatcher } from './origin-reg-exp-matcher';
import { originStringMatcher } from './origin-string-matcher';

export const originMatcherList: OriginMatcher[] = [
  originRegExpMatcher,
  originStringMatcher,
  originPredicateMatcher
];

export function findMatcher(matchExpression) {
  return originMatcherList.find(matcher => matcher.canHandle(matchExpression));
}
