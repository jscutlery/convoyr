import { isArray } from '../../utils/is-array';
import { findMatcher } from './find-matcher';
import { originStringMatcher } from './origin-string-matcher';

export const originArrayMatcher = {
  canHandle(matchExpression) {
    return isArray(matchExpression);
  },
  handle({ origin, matchExpression }) {
    /* Loop through expressions... */
    return matchExpression.some(childExpression => {
      /* ... find the right matcher for each expression... */
      const matcher = findMatcher({
        matchExpression: childExpression,
        matcherList: [originStringMatcher]
      });

      /* ... and handle the expression. */
      return matcher.handle({
        origin,
        matchExpression: childExpression
      });
    });
  }
};
