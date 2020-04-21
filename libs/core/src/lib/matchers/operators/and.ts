import { RequestCondition } from '../../plugin';

export const and = (...predicates: RequestCondition[]): RequestCondition => (
  request
) => predicates.every((predicate) => predicate(request));
