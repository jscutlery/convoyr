import { HttpExtResponse } from '@http-ext/core';

export function isServerError(response: HttpExtResponse): boolean {
  return response.status >= 500;
}
