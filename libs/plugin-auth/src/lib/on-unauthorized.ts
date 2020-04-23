import { ConvoyrResponse } from '@convoyr/core';

export type OnUnauthorized = (response: ConvoyrResponse) => void;
