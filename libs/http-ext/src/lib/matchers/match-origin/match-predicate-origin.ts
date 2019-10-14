import { isFunction } from '../../utils/is-function';

export type Predicate = (origin: string) => boolean;

export function matchPredicateOrigin(
  origin: string,
  predicate: Predicate
): boolean {
  if (isFunction(predicate)) {
    return predicate(origin);
  }

  return false;
}
