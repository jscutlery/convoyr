import { RequestCondition } from '../../plugin';
import { getOrigin } from './get-origin';
import { matchArrayOrigin } from './match-array-origin';
import { matchPredicateOrigin } from './match-predicate-origin';
import { originRegExpMatcher } from './match-reg-exp-origin';
import { OriginMatchExpression } from './origin-match-expression';
import { OriginMatcher } from './origin-matcher';
import { originStringMatcher } from './origin-string-matcher';

export const originMatcherList: OriginMatcher[] = [
  originRegExpMatcher,
  originStringMatcher
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

  return [matchArrayOrigin, matchPredicateOrigin].some(match =>
    match(origin, matchExpression)
  );
};
