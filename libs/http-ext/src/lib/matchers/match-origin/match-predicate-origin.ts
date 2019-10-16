import { isFunction } from '../../utils/is-function';

export type OriginMatchPredicate = (origin: string) => boolean;

export const matchPredicateOrigin = (
  origin: string,
  predicate: OriginMatchPredicate
): boolean => isFunction(predicate) && predicate(origin);
