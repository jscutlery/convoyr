import { RequestCondition } from '../../plugin';
import { findMatcher } from './find-matcher';
import { getOrigin } from './get-origin';
import { matchArrayOrigin } from './match-array-origin';
import { OriginMatchExpression } from './origin-match-expression';

export const matchOrigin = (
  matchExpression: OriginMatchExpression
): RequestCondition => ({ request }): boolean => {
  const origin = getOrigin(request.url);

  const matcher = findMatcher(matchExpression);

  if (matcher != null) {
    return matcher.handle({
      matchExpression,
      origin
    });
  }

  return [matchArrayOrigin].some(match => match(origin, matchExpression));
};
