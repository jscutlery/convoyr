import { Matcher } from './match-origin';

export const matchRegExpOrigin = (
  origin: string,
  matcher: Matcher,
): boolean => (matcher instanceof RegExp && matcher.test(origin) ? true : false);
