import { RetryPredicate } from '@http-ext/plugin-retry';

export const isServerError: RetryPredicate = response => response.status >= 500;
