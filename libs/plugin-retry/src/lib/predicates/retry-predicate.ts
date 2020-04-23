import { ConvoyResponse } from '@convoyr/core';

export type RetryPredicate = (response: ConvoyResponse) => boolean;
