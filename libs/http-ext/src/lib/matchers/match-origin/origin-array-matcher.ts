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
  handle({ origin, matchExpression }) {
    /* Loop through expressions... */
    return matchExpression.some(childExpression => {
      /* ... find the right matcher for each expression... */
      const matcher = findMatcherOrThrow({
        matchExpression: childExpression,
        matcherList: [originStringMatcher],
        errorFactory: invalidOriginMatchExpression
      });

      /* ... and handle the expression. */
      return matcher.handle({
        origin,
        matchExpression: childExpression
      });
    });
  }
};
