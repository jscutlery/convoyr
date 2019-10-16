import { RequestCondition } from '../../plugin';
import { findMatcherOrThrow } from './find-matcher-or-throw';
import { getOrigin } from './get-origin';
import { originArrayMatcher } from './origin-array-matcher';
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
  const matcher = findMatcherOrThrow({
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
