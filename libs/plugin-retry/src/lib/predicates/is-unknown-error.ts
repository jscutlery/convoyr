import { HttpExtResponse } from '@http-ext/core';

export function isUnknownError(response: HttpExtResponse): boolean {
  return response.status === 0;
}
