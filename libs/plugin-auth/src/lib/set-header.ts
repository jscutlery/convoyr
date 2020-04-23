import { HttpExtRequest } from '@convoy/core';

export function setHeader({
  request,
  key,
  value,
}: {
  request: HttpExtRequest;
  key: string;
  value: string;
}): HttpExtRequest {
  return {
    ...request,
    headers: {
      ...request.headers,
      [key]: value,
    },
  };
}
