import { RetryPredicate } from '@http-ext/plugin-retry';

export const isUnknownError: RetryPredicate = response => response.status === 0;
