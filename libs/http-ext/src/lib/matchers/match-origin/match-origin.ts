import { HttpExtRequest } from '../../request';
import { matchArrayOrigin } from './match-array-origin';
import { matchPredicateOrigin, Predicate } from './match-predicate-origin';
import { matchRegExpOrigin } from './match-reg-exp-origin';
import { matchStringOrigin } from './match-string-origin';

export type Matcher = string | string[] | RegExp | Predicate;

export function matchOrigin(
  matcher: Matcher,
  request: HttpExtRequest
): boolean {
  return [
    matchStringOrigin,
    matchArrayOrigin,
    matchRegExpOrigin,
    matchPredicateOrigin,
  ].some(match => match(request.url, matcher));
}
