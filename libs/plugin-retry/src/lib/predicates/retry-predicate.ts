import { HttpExtResponse } from '@http-ext/core';

export type RetryPredicate = (response: HttpExtResponse) => boolean;
