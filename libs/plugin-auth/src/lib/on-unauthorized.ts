import { ConvoyResponse } from '@convoyr/core';

export type OnUnauthorized = (response: ConvoyResponse) => void;
