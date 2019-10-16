import { RequestCondition } from '../../plugin';
import { findMatcher } from './find-matcher';
import { getOrigin } from './get-origin';
import { originArrayMatcher } from './match-array-origin';
import { OriginMatchExpression } from './origin-match-expression';
import { originPredicateMatcher } from './origin-predicate-matcher';
import { originRegExpMatcher } from './origin-reg-exp-matcher';
import { originStringMatcher } from './origin-string-matcher';

export const matchOrigin = (
  matchExpression: OriginMatchExpression
): RequestCondition => ({ request }): boolean => {
  /* Extract origin from URL. */
  const origin = getOrigin(request.url);

  /* Find the right matcher. */
  const matcher = findMatcher({
    matchExpression: matchExpression,
    matcherList: [
      originStringMatcher,
      originArrayMatcher,
      originRegExpMatcher,
      originPredicateMatcher
    ]
  });

  /* Handle the origin with the right matcher. */
  return matcher.handle({
    matchExpression,
    origin
  });
};
