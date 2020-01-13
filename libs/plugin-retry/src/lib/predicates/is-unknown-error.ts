import { RetryPredicate } from './retry-predicate';

export const isUnknownError: RetryPredicate = response => response.status === 0;
