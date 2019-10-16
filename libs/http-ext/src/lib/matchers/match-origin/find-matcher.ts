import { OriginMatchExpression } from './origin-match-expression';
import { OriginMatcher } from './origin-matcher';

export function findMatcher({
  matchExpression,
  matcherList
}: {
  matchExpression: OriginMatchExpression;
  matcherList: OriginMatcher[];
}) {
  return matcherList.find(matcher => matcher.canHandle(matchExpression));
}
