import { isArray } from '../../utils/is-array';
import { findMatcher } from './find-matcher';
import { OriginMatchExpression } from './origin-match-expression';
import { originStringMatcher } from './origin-string-matcher';

export const matchArrayOrigin = (
  origin: string,
  matchers: OriginMatchExpression
): boolean =>
  isArray(matchers) &&
  matchers.some(matchExpression =>
    originStringMatcher.handle({ origin, matchExpression })
  );

export const originArrayMatcher = {
  canHandle(matchExpression) {
    return isArray(matchExpression);
  },
  handle({ origin, matchExpression }) {
    /* Loop through expressions... */
    return matchExpression.some(childExpression => {
      /* ... find the right matcher for each expression... */
      const matcher = findMatcher({ matchExpression: childExpression });

      /* ... and handle the expression. */
      return matcher.handle({
        origin,
        matchExpression: childExpression
      });
    });
  }
};
