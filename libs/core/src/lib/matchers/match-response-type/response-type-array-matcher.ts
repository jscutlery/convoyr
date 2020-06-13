import { isArray } from '../../utils/is-array';
import { findMatcherOrThrow } from '../find-matcher-or-throw';
import { Matcher } from '../matcher';
import { invalidResponseTypeMatchExpression } from './invalid-response-type-match-expression';
import { ResponseTypeMatcher } from './match-response-type-expression';
import { responseTypeStringMatcher } from './response-type-string-matcher';

export const responseTypeArrayMatcher: Matcher<ResponseTypeMatcher[]> = {
  canHandle(matchExpression) {
    return isArray(matchExpression);
  },
  handle({ value, matchExpression }) {
    return matchExpression.some((childExpression) => {
      const matcher = findMatcherOrThrow({
        matchExpression: childExpression,
        matcherList: [responseTypeStringMatcher],
        matcherError: invalidResponseTypeMatchExpression(matchExpression),
      });

      return matcher.handle({
        value,
        matchExpression: childExpression,
      });
    });
  },
};
