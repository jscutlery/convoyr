import { iif, Observable, of, throwError } from 'rxjs';

import { isBoolean } from './utils/is-boolean';

export function invalidPluginConditionError(type: string) {
  return `InvalidPluginConditionError: expecting boolean got ${type}.`;
}

export const throwIfInvalidPluginCondition = (
  condition: boolean
): Observable<boolean> =>
  iif(
    () => isBoolean(condition),
    of(condition),
    throwError(invalidPluginConditionError(typeof condition))
  );
