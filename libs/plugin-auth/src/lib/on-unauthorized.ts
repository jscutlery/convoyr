import { ConvoyResponse } from '@convoy/core';

export type OnUnauthorized = (response: ConvoyResponse) => void;
