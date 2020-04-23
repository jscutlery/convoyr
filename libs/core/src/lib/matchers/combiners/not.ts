import { RequestCondition } from '../../plugin';

export const not = (predicate: RequestCondition): RequestCondition => (
  request
) => !predicate(request);
