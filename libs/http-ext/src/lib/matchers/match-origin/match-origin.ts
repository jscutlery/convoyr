import { RequestCondition } from '../../plugin';
import { getOrigin } from './get-origin';
import { matchArrayOrigin } from './match-array-origin';
import { OriginMatchExpression } from './origin-match-expression';
import { matchPredicateOrigin } from './match-predicate-origin';
import { matchRegExpOrigin } from './match-reg-exp-origin';
import { matchStringOrigin } from './match-string-origin';

export const matchOrigin = (
  matchExpression: OriginMatchExpression
): RequestCondition => ({ request }): boolean => {
  const origin = getOrigin(request.url);

  return [
    matchStringOrigin,
    matchArrayOrigin,
    matchRegExpOrigin,
    matchPredicateOrigin
  ].some(match => match(origin, matchExpression));
};
