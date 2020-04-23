import { ConvoyrResponse } from '@convoyr/core';

export type RetryPredicate = (response: ConvoyrResponse) => boolean;
