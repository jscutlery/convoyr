import * as bytes from 'bytes';

export function invalidMaxSizeError(maxSize: any) {
  return new Error(
    `InvalidMaxSizeError: ${JSON.stringify(maxSize)} is not a valid max size.`
  );
}

export function parseMaxSize(maxSize?: string) {
  if (maxSize == null) {
    return null;
  }

  const maxSizeInBytes = bytes(maxSize);

  // if (isNaN(maxSizeInBytes)) {
  //   throw invalidMaxSizeError(maxSize);
  // }

  return maxSizeInBytes;
}
