export const getOrigin = (url: string): string => {
  const [protocol,, host] = url.split(/\/|\?/);
  return `${protocol}//${host}`;
}
