import { RequestCondition } from '../../plugin';
import { getOrigin } from './get-origin';
import { matchArrayOrigin } from './match-array-origin';
import { matchPredicateOrigin, Predicate } from './match-predicate-origin';
import { matchRegExpOrigin } from './match-reg-exp-origin';
import { matchStringOrigin } from './match-string-origin';

export type Matcher = string | string[] | RegExp | Predicate;

export const matchOrigin = (matcher: Matcher): RequestCondition => ({
  request
}): boolean => {
  const origin = getOrigin(request.url);

  return [
    matchStringOrigin,
    matchArrayOrigin,
    matchRegExpOrigin,
    matchPredicateOrigin
  ].some(match => match(origin, matcher));
};
