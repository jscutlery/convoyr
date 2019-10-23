import { RequestCondition } from '../../plugin';
import { findMatcherOrThrow } from '../find-matcher-or-throw';
import { invalidMethodMatchExpression } from './invalid-method-match-expression';
import { MatchMethodExpression } from './match-method-expression';
import { methodArrayMatcher } from './method-array-matcher';
import { methodStringMatcher } from './method-string-matcher';

export const matchMethod = (
  matchExpression: MatchMethodExpression
): RequestCondition => ({ request }): boolean => {
  const { method } = request;

  /* Find the right matcher. */
  const matcher = findMatcherOrThrow({
    matchExpression: matchExpression,
    matcherList: [methodStringMatcher, methodArrayMatcher],
    errorFactory: invalidMethodMatchExpression
  });

  /* Handle the method with the right matcher. */
  return matcher.handle({
    matchExpression,
    method
  });
};
