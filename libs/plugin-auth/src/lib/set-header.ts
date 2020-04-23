import { ConvoyRequest } from '@convoyr/core';

export function setHeader({
  request,
  key,
  value,
}: {
  request: ConvoyRequest;
  key: string;
  value: string;
}): ConvoyRequest {
  return {
    ...request,
    headers: {
      ...request.headers,
      [key]: value,
    },
  };
}
