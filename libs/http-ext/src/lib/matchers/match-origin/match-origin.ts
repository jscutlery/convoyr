import { RequestCondition } from '../../plugin';
import { findMatcher } from './find-matcher';
import { getOrigin } from './get-origin';
import { matchArrayOrigin, originArrayMatcher } from './match-array-origin';
import { OriginMatchExpression } from './origin-match-expression';
import { originPredicateMatcher } from './origin-predicate-matcher';
import { originRegExpMatcher } from './origin-reg-exp-matcher';
import { originStringMatcher } from './origin-string-matcher';

export const matchOrigin = (
  matchExpression: OriginMatchExpression
): RequestCondition => ({ request }): boolean => {
  const origin = getOrigin(request.url);

  const matcher = findMatcher({
    matchExpression: matchExpression,
    matcherList: [
      originRegExpMatcher,
      originStringMatcher,
      originPredicateMatcher
    ]
  });

  if (matcher != null) {
    return matcher.handle({
      matchExpression,
      origin
    });
  }

  return [matchArrayOrigin].some(match => match(origin, matchExpression));
};
