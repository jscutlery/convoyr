import { HttpExtResponse, HttpExtRequest } from '@http-ext/core';

export type OnUnauthorized = ({
  request,
  response
}: {
  request: HttpExtRequest;
  response: HttpExtResponse;
}) => void;
