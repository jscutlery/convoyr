import { ConvoyResponse } from '@convoy/core';

export type RetryPredicate = (response: ConvoyResponse) => boolean;
