import { combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { RequestCondition } from '../../plugin';
import { fromSyncOrAsync } from '../../utils/from-sync-or-async';

export const or = (...predicates: RequestCondition[]): RequestCondition => ({
  request,
}) => {
  const observableList = predicates.map((predicate) =>
    fromSyncOrAsync(predicate({ request }))
  );
  return combineLatest(observableList).pipe(
    take(1),
    map((resultList) => resultList.some((value) => value === true))
  );
};
