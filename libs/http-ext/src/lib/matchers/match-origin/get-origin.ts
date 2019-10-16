export const getOrigin = (url: string): string => {
  const [scheme, urlWithoutScheme] = url.split('://');

  const result = urlWithoutScheme.match(/^[a-z0-9.:-]+/);

  const originWithoutScheme = result ? result[0] : null;

  return `${scheme}://${originWithoutScheme}`;
};
