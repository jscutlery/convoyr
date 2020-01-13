import { RetryPredicate } from './retry-predicate';
import { isServerError } from './is-server-error';
import { isUnknownError } from './is-unknown-error';

export const or = <TArgs extends any[]>(
  ...predicates: ((...args: TArgs) => boolean)[]
) => (...args: TArgs) => {
  return predicates.some(predicate => predicate(...args));
};

export const isServerOrUnknownError: RetryPredicate = response => {
  return or(isServerError, isUnknownError)(response);
};
