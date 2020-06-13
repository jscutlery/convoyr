import { RequestCondition } from '../../plugin';
import { findMatcherOrThrow } from '../find-matcher-or-throw';
import { getOrigin } from './get-origin';
import { invalidOriginMatchExpression } from './invalid-origin-match-expression';
import { originArrayMatcher } from './origin-array-matcher';
import { OriginMatchExpression } from './origin-match-expression';
import { originPredicateMatcher } from './origin-predicate-matcher';
import { originRegExpMatcher } from './origin-reg-exp-matcher';
import { originStringMatcher } from './origin-string-matcher';

export const matchOrigin = (
  matchExpression: OriginMatchExpression
): RequestCondition => ({ request }): boolean => {
  const origin = getOrigin(request.url);
  const matcher = findMatcherOrThrow({
    matchExpression: matchExpression,
    matcherList: [
      originStringMatcher,
      originArrayMatcher,
      originRegExpMatcher,
      originPredicateMatcher,
    ],
    matcherError: invalidOriginMatchExpression(matchExpression),
  });

  return matcher.handle({
    matchExpression,
    value: origin,
  });
};
