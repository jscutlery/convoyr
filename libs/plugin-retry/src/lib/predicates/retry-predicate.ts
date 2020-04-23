import { HttpExtResponse } from '@convoy/core';

export type RetryPredicate = (response: HttpExtResponse) => boolean;
