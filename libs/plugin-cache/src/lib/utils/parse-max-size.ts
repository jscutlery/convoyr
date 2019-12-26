import * as _bytes from 'bytes';

/* @hack fixes "Cannot call a namespace (bytes)" error. */
const bytes = _bytes;

export function invalidMaxSizeError(maxSize: any) {
  return new Error(
    `InvalidMaxSizeError: ${JSON.stringify(maxSize)} is not a valid max size.`
  );
}

export function parseMaxSize(prettySize?: string) {
  if (prettySize == null) {
    return null;
  }

  const sizeInBytes = bytes(prettySize);

  if (isNaN(sizeInBytes) || typeof sizeInBytes !== 'number') {
    throw invalidMaxSizeError(prettySize);
  }

  return sizeInBytes;
}
