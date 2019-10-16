export const getOrigin = (url: string): string => {
  const [scheme, urlWithoutScheme] = url.split('://');

  const [, , host] = url.split(/\/|\?/);
  return `${scheme}://${host}`;
};
