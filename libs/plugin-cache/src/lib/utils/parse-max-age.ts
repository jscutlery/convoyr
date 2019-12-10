import ms from 'ms';

export function invalidTtlError(ttl: string) {
  return new Error(
    `InvalidTtlError: ${JSON.stringify(ttl)} is not a valid ttl.`
  );
}

export function parseMaxAge(maxAge: string) {
  if (maxAge == null) {
    return null;
  }

  const ttlMicroseconds = ms(maxAge);

  if (ttlMicroseconds == null) {
    throw invalidTtlError(maxAge);
  }

  return ttlMicroseconds;
}
