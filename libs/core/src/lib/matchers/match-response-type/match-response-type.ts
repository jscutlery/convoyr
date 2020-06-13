import { RequestCondition } from '../../plugin';
import { findMatcherOrThrow } from '../find-matcher-or-throw';
import { invalidResponseTypeMatchExpression } from './invalid-response-type-match-expression';
import { ResponseTypeMatchExpression } from './match-response-type-expression';
import { responseTypeArrayMatcher } from './response-type-array-matcher';
import { responseTypeStringMatcher } from './response-type-string-matcher';

export const matchResponseType = (
  matchExpression: ResponseTypeMatchExpression
): RequestCondition => ({ request }): boolean => {
  const matcher = findMatcherOrThrow({
    matchExpression: matchExpression,
    matcherList: [responseTypeStringMatcher, responseTypeArrayMatcher],
    matcherError: invalidResponseTypeMatchExpression(matchExpression),
  });

  return matcher.handle({
    matchExpression,
    value: request.responseType,
  });
};
