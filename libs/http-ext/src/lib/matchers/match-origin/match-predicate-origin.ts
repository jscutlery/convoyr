import { isFunction } from '../../utils/is-function';

export type Predicate = (origin: string) => boolean;

export const matchPredicateOrigin = (
  origin: string,
  predicate: Predicate
): boolean => isFunction(predicate) && predicate(origin);
