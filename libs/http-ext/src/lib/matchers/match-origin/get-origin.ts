export function invalidUrlError(url: string) {
  return new Error(`InvalidUrlError: ${url} is not a valid URL.`);
}

export const getOrigin = (url: string): string => {
  const [scheme, urlWithoutScheme] = url.split('://');

  if (scheme == null && urlWithoutScheme == null) {
    throw invalidUrlError(url);
  }

  const result = urlWithoutScheme.match(/^[a-z0-9.:-]+/);

  if (result == null) {
    throw invalidUrlError(url);
  }

  const originWithoutScheme = result[0];

  return `${scheme}://${originWithoutScheme}`;
};
