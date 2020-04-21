import { RequestCondition } from '../../plugin';

export const or = (...predicates: RequestCondition[]): RequestCondition => (
  request
) => predicates.some((predicate) => predicate(request));
