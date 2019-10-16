import { RequestCondition } from '../../plugin';
import { getOrigin } from './get-origin';
import { matchArrayOrigin } from './match-array-origin';
import { originPredicateMatcher } from './origin-predicate-matcher';
import { OriginMatchExpression } from './origin-match-expression';
import { OriginMatcher } from './origin-matcher';
import { originRegExpMatcher } from './origin-reg-exp-matcher';
import { originStringMatcher } from './origin-string-matcher';

export const originMatcherList: OriginMatcher[] = [
  originRegExpMatcher,
  originStringMatcher,
  originPredicateMatcher
];

export const matchOrigin = (
  matchExpression: OriginMatchExpression
): RequestCondition => ({ request }): boolean => {
  const origin = getOrigin(request.url);

  const matcher = originMatcherList.find(_matcher =>
    _matcher.canHandle(matchExpression)
  );

  if (matcher != null) {
    return matcher.handle({
      matchExpression,
      origin
    });
  }

  return [matchArrayOrigin].some(match => match(origin, matchExpression));
};
