import { HttpExtResponse } from '@convoy/core';

export type OnUnauthorized = (response: HttpExtResponse) => void;
