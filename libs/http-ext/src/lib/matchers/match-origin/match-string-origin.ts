import { isString } from '../../utils/is-string';
import { Matcher } from './match-origin';

export const matchStringOrigin = (
  origin: string,
  matcher: Matcher
): boolean => {
  if (isString(matcher)) {
    const [protocol,, host] = origin.split(/\/|\?/);
    return `${protocol}//${host}` === matcher;
  }

  return false;
};
