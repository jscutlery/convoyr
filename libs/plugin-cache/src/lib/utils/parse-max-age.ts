import * as _ms from 'ms';
/* @hack fixes "Cannot call a namespace (ms)" error. */
const ms = _ms;

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
