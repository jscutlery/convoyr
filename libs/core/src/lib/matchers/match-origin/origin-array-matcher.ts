import { isArray } from '../../utils/is-array';
import { findMatcherOrThrow } from '../find-matcher-or-throw';
import { Matcher } from '../matcher';
import { invalidOriginMatchExpression } from './invalid-origin-match-expression';
import { OriginMatcher } from './origin-match-expression';
import { originStringMatcher } from './origin-string-matcher';

export const originArrayMatcher: Matcher<OriginMatcher[]> = {
  canHandle(matchExpression) {
    return isArray(matchExpression);
  },
  handle({ value, matchExpression }) {
    return matchExpression.some((childExpression) => {
      const matcher = findMatcherOrThrow({
        matchExpression: childExpression,
        matcherList: [originStringMatcher],
        matcherError: invalidOriginMatchExpression(matchExpression),
      });

      return matcher.handle({
        value,
        matchExpression: childExpression,
      });
    });
  },
};
