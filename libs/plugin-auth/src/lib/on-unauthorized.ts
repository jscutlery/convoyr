import { HttpExtResponse } from '@http-ext/core';

export type OnUnauthorized = (response: HttpExtResponse) => void;
