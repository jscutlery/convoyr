import { Predicate } from './match-origin';

export function matchPredicateOrigin(origin: string, predicate: Predicate): boolean {
  if (typeof predicate === 'function') {
    return predicate(origin);
  }

  return false;
}
