import { ConvoyrRequest } from '@convoyr/core';

export function setHeader({
  request,
  key,
  value,
}: {
  request: ConvoyrRequest;
  key: string;
  value: string;
}): ConvoyrRequest {
  return {
    ...request,
    headers: {
      ...request.headers,
      [key]: value,
    },
  };
}
