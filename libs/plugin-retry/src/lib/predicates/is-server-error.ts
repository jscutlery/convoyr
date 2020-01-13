import { RetryPredicate } from './retry-predicate';

export const isServerError: RetryPredicate = response => response.status >= 500;
