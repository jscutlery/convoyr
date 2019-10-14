import { Matcher } from './match-origin';

export const matchArrayOrigin = (
  origin: string,
  matcher: Matcher,
): boolean =>
  Array.isArray(matcher) && matcher.length > 0 && matcher.includes(origin)
    ? true
    : false;
